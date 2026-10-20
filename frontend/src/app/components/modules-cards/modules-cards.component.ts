import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, filter, take, takeUntil } from 'rxjs/operators';
import { ModuleService, SystemModule } from 'src/app/services/module.service';

/** Presentation metadata for a module card (icons/routes are UI concerns). */
interface ModulePresentation {
  icon: string;
  route: string;
  fallbackName: string;
  fallbackDescription: string;
}

/** A card combines the backend entitlement state with presentation metadata. */
export interface ModuleCard {
  slug: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  isCore: boolean;
  isEnabled: boolean;
}

/**
 * The six sellable modules, in catalogue order. This list is the single source
 * of truth for which cards the dashboard renders: every module always gets a
 * card — disabled ones are simply dimmed, never hidden.
 */
const MODULE_ORDER = ['core', 'crm', 'ticketing', 'projects', 'hr', 'admin'];

const MODULE_PRESENTATION: Record<string, ModulePresentation> = {
  core: {
    icon: 'bx bx-shield-quarter',
    route: '/my_work',
    fallbackName: 'Core (Users, Auth & Permissions)',
    fallbackDescription:
      'Authentication, users, roles and permissions. Always required and always enabled.',
  },
  crm: {
    icon: 'bx bx-line-chart',
    route: '/CRM/activities',
    fallbackName: 'CRM',
    fallbackDescription:
      'Leads, contacts, accounts, activities, campaigns, POC and RFP requests.',
  },
  ticketing: {
    icon: 'bx bx-support',
    route: '/tickets',
    fallbackName: 'Ticketing & Support',
    fallbackDescription:
      'Client tickets, contract support, client accounts, licences, ratings and installments.',
  },
  projects: {
    icon: 'bx bx-briefcase-alt-2',
    route: '/manager',
    fallbackName: 'Projects',
    fallbackDescription:
      'Projects, processes, tasks, timesheets, reports and PM team requests.',
  },
  hr: {
    icon: 'bx bx-group',
    route: '/hr',
    fallbackName: 'Human Resources',
    fallbackDescription:
      'Recruitment, onboarding, salaries, vacations, incentives, transport requests and policies.',
  },
  admin: {
    icon: 'bx bx-cog',
    route: '/admin-panel',
    fallbackName: 'Administration',
    fallbackDescription:
      'Organisational settings, departments, products, permissions, logs, announcements and public requests.',
  },
};

/**
 * Modules dashboard: renders every sellable module as a card.
 *
 *  - enabled modules are normal, clickable cards that navigate into the module
 *  - disabled modules stay visible but are dimmed/grayed with a lock badge and
 *    route to the "module not enabled" page instead of entering the module
 *
 * The full catalogue (including disabled modules) is loaded before render.
 */
@Component({
  selector: 'app-modules-cards',
  templateUrl: './modules-cards.component.html',
  styleUrls: ['./modules-cards.component.scss'],
})
export class ModulesCardsComponent implements OnInit, OnDestroy {
  cards: ModuleCard[] = [];
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(private moduleService: ModuleService, private router: Router) {}

  ngOnInit(): void {
    // Wait for entitlements to be loaded, then fetch the full catalogue so
    // disabled modules appear (dimmed) alongside enabled ones.
    this.moduleService.loaded$
      .pipe(
        filter((loaded) => loaded),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loadCatalogue());

    // Re-render immediately if a cached catalogue already exists.
    this.moduleService.catalogue$
      .pipe(takeUntil(this.destroy$))
      .subscribe((catalogue) => {
        this.cards = this.buildCards(catalogue);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * A disabled card never navigates into the module; it sends the user to the
   * module-disabled page (the ModuleGuard would block the deep link anyway).
   */
  onCardClick(card: ModuleCard): void {
    if (card.isEnabled) {
      this.router.navigateByUrl(card.route);
      return;
    }

    this.router.navigate(['/module-disabled'], {
      queryParams: { module: card.slug },
    });
  }

  /** Expose the enabled check to the template for keyboard accessibility. */
  isEnabled(slug: string): boolean {
    return this.moduleService.isModuleEnabled(slug);
  }

  private loadCatalogue(): void {
    (this.moduleService.loadCatalogue() as Observable<SystemModule[]>)
      .pipe(
        catchError(() => of([])),
        take(1)
      )
      .subscribe((catalogue) => {
        this.cards = this.buildCards(catalogue);
        this.loading = false;
      });
  }

  /**
   * Build exactly one card per known slug. Catalogue data (name/description/
   * state) wins; presentation metadata fills any gap so all six cards always
   * render even if the catalogue request failed.
   */
  private buildCards(catalogue: SystemModule[]): ModuleCard[] {
    return MODULE_ORDER.map((slug) => {
      const meta = MODULE_PRESENTATION[slug];
      const entry = catalogue.find((m) => m.slug === slug);

      return {
        slug,
        name: entry?.name ?? meta.fallbackName,
        description: entry?.description ?? meta.fallbackDescription,
        icon: meta.icon,
        route: meta.route,
        isCore: entry ? !!entry.is_core : slug === 'core',
        isEnabled: entry
          ? !!entry.is_enabled
          : this.moduleService.isModuleEnabled(slug),
      };
    });
  }
}
