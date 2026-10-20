import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, filter, take, takeUntil } from 'rxjs/operators';
import { ModuleService, SystemModule } from 'src/app/services/module.service';
import {
  MODULE_META,
  MODULE_SLUGS,
} from 'src/app/services/module-pages.registry';

/** A card combines the backend entitlement state with presentation metadata. */
export interface ModuleCard {
  slug: string;
  name: string;
  description: string;
  icon: string;
  isCore: boolean;
  isEnabled: boolean;
}

/**
 * Modules dashboard: renders every sellable module as a card.
 *
 *  - enabled modules are normal, clickable cards that open the module's
 *    feature-cards page (/modules/:slug), which mirrors the sidebar links
 *  - disabled modules stay visible but are dimmed/grayed with a lock badge
 *    and route to the "module not enabled" page instead of entering the module
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
   * Enabled card -> the module landing page with one card per sidebar
   * feature. Disabled card -> the module-disabled page (the ModuleGuard
   * would block the deep link anyway).
   */
  onCardClick(card: ModuleCard): void {
    if (card.isEnabled) {
      this.router.navigate(['/modules', card.slug]);
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
   * state) wins; shared presentation metadata fills any gap so all six cards
   * always render even if the catalogue request failed.
   */
  private buildCards(catalogue: SystemModule[]): ModuleCard[] {
    return MODULE_SLUGS.map((slug) => {
      const meta = MODULE_META[slug];
      const entry = catalogue.find((m) => m.slug === slug);

      return {
        slug,
        name: entry?.name ?? meta.name,
        description: entry?.description ?? meta.description,
        icon: meta.icon,
        isCore: entry ? !!entry.is_core : slug === 'core',
        isEnabled: entry
          ? !!entry.is_enabled
          : this.moduleService.isModuleEnabled(slug),
      };
    });
  }
}
