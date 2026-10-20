import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';
import {
  MODULE_META,
  MODULE_PAGES,
  MODULE_SLUGS,
  ModulePage,
  ModulePageSection,
} from 'src/app/services/module-pages.registry';
import { ModulePagesService } from 'src/app/services/module-pages.service';

/**
 * Module landing page: renders every feature the selected module contains
 * as a card, grouped into the same collapsible sections as the sidebar
 * (same titles, routes and permission/department visibility rules).
 * Clicking a card opens the real feature page; the feature guards still
 * enforce access on navigation.
 */
@Component({
  selector: 'app-module-details',
  templateUrl: './module-details.component.html',
  styleUrls: ['./module-details.component.scss'],
})
export class ModuleDetailsComponent implements OnInit, OnDestroy {
  slug = '';
  sections: ModulePageSection[] = [];
  private userSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modulePagesService: ModulePagesService,
    private authApi: AuthApiService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';

    // Unknown module -> back to the dashboard.
    if (!MODULE_SLUGS.includes(this.slug) || !MODULE_PAGES[this.slug]) {
      this.router.navigateByUrl('/modules');
      return;
    }

    // Disabled module -> the standard "not enabled" page (the dashboard
    // already prevents the click, this guards direct URLs).
    if (!this.modulePagesService.isModuleEnabled(this.slug)) {
      this.router.navigate(['/module-disabled'], {
        queryParams: { module: this.slug, returnUrl: '/modules' },
      });
      return;
    }

    this.loadSections();

    // Permissions arrive shortly after bootstrap; re-evaluate when the user
    // stream emits so the cards match the sidebar exactly.
    this.userSub = this.authApi.user.subscribe(() => this.loadSections());
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  get meta() {
    return MODULE_META[this.slug];
  }

  /** Flattened visible cards, mainly for tests/empty-state checks. */
  get pages(): ModulePage[] {
    return this.sections.reduce<ModulePage[]>(
      (all, section) => all.concat(section.pages),
      []
    );
  }

  get totalCards(): number {
    return this.pages.length;
  }

  backToModules(): void {
    this.router.navigateByUrl('/modules');
  }

  private loadSections(): void {
    this.sections = this.modulePagesService.sectionsFor(this.slug);
  }
}
