import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BmsAccessService } from '../components/bms/bms-access.service';
import { BmsLanguageService } from '../components/bms/bms-language.service';
import { AccountPositions, Department } from '../interfaces/user';
import { ModuleService } from '../services/module.service';
import { NavContext, VisibleNavGroup } from './navigation/nav.model';
import { NAV_EXTRA_TITLES, NAV_GROUPS } from './navigation/nav.registry';
import { activeNav, normalizeUrl, visibleGroups } from './navigation/nav.util';
import { OpenToWorkDialogComponent } from './open-to-work/open-to-work.component';
import { BmsFeedService } from './bms-feed.service';
import { BmsRequestContext, shouldLoadBmsAbilities } from './bms-requests.policy';
import { ShellSessionService } from './shell-session.service';

const COLLAPSE_KEY = 'ui-sidebar-collapsed';
/** Below this width the sidebar becomes an off-canvas drawer. */
export const SHELL_MOBILE_BREAKPOINT = 992;
/** Below this width the header drops its text labels. */
export const SHELL_COMPACT_BREAKPOINT = 640;
/** Between the mobile breakpoint and this width the sidebar defaults to the icon rail. */
export const SHELL_WIDE_BREAKPOINT = 1280;

/**
 * The single application shell: ONE sidebar, ONE header and ONE content
 * outlet for every authenticated page — BMS and legacy workspaces alike.
 *
 * It replaces the two shells that used to be nested (the legacy
 * `NavbarComponent` layout wrapping the BMS-only `BmsShellComponent`).
 */
@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnInit, OnDestroy {
  @ViewChild(OpenToWorkDialogComponent) openToWorkDialog: OpenToWorkDialogComponent | undefined;

  direction: 'ltr' | 'rtl' = this.lang.direction;
  groups: VisibleNavGroup[] = [];
  activeGroupId = '';
  activeItemId = '';
  groupLabel = '';
  pageLabel = '';
  /** BMS pages are translated and follow the shell direction; legacy pages stay LTR for now. */
  translatedContent = false;

  /** The explicit choice of the user, when there is one; otherwise the width decides. */
  private collapsePreference: boolean | null = AppShellComponent.readCollapsed();
  collapsed = AppShellComponent.resolveCollapsed(this.collapsePreference, AppShellComponent.viewportWidth());
  mobile = AppShellComponent.viewportWidth() < SHELL_MOBILE_BREAKPOINT;
  compact = AppShellComponent.viewportWidth() < SHELL_COMPACT_BREAKPOINT;
  menuOpen = false;

  abilities: string[] | null = null;
  abilitiesFailed = false;

  private subs: Subscription[] = [];
  private wasInBms = false;
  /** Whether the last evaluation allowed asking the server for BMS abilities. */
  private bmsAllowed = false;
  private started = false;

  constructor(
    public lang: BmsLanguageService,
    public session: ShellSessionService,
    private access: BmsAccessService,
    private modules: ModuleService,
    private feed: BmsFeedService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.session.start();
    this.wasInBms = AppShellComponent.isBmsUrl(this.router.url);

    this.subs.push(
      // Direction is applied to the shell element only, never to <html>.
      this.lang.language$.subscribe(() => this.direction = this.lang.direction),
      this.session.changes$.subscribe(() => this.resolveNavigation()),
      this.modules.enabledModules$.subscribe(() => {
        this.resolveNavigation();
        // The entitlement list arrives after sign-in: start (or stop) BMS requests when it changes the answer.
        if (this.started && this.canRequestBms() !== this.bmsAllowed) this.refreshAbilities();
      }),
      this.access.abilities$.subscribe(abilities => {
        // A page may reset the abilities and re-read them while it is being created (the no-access screen
        // does). Keep showing the last known answer until the new one arrives: blanking it here would flash
        // the sidebar into its loading state and change this component in the middle of a render pass.
        if (abilities === null && this.abilities !== null) return;
        this.abilities = abilities;
        this.resolveNavigation();
      }),
      this.access.loadFailed$.subscribe(failed => this.abilitiesFailed = failed),
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        this.menuOpen = false;
        // The retired BMS shell reloaded abilities every time the user entered /bms.
        const inBms = AppShellComponent.isBmsUrl(this.router.url);
        const entered = inBms && !this.wasInBms;
        const left = !inBms && this.wasInBms;
        this.wasInBms = inBms;
        if (entered) this.refreshAbilities();
        // Leaving BMS issues no request; it only drops what the user is not eligible for elsewhere.
        else if (left) this.feed.sync(this.bmsRequestContext(), false);
        this.resolveActive();
      }),
    );

    // Only now, with every listener in place, is BMS asked for anything.
    this.started = true;
    this.refreshAbilities();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
    this.started = false;
    this.session.stop();
    this.feed.clear();
  }

  /** BMS is asked only for companies that own the module, or on BMS pages themselves. */
  private canRequestBms(): boolean {
    return shouldLoadBmsAbilities({ inBms: AppShellComponent.isBmsUrl(this.router.url), moduleEnabled: this.modules.isModuleEnabled('bms') });
  }

  private bmsRequestContext(): BmsRequestContext {
    return {
      inBms: AppShellComponent.isBmsUrl(this.router.url),
      moduleEnabled: this.modules.isModuleEnabled('bms'),
      abilities: this.abilities,
      failed: this.abilitiesFailed,
    };
  }

  /** True while the sidebar is still waiting for the first abilities answer. */
  get abilitiesLoading(): boolean { return this.bmsAllowed && this.abilities === null; }

  /**
   * The single entry point for BMS requests made by the shell: abilities first,
   * then - once, per answer - the alerts and notifications the user is eligible for.
   */
  refreshAbilities(): void {
    this.bmsAllowed = this.canRequestBms();
    if (!this.bmsAllowed) {
      this.feed.sync(this.bmsRequestContext(), false);
      return;
    }
    this.access.refresh().subscribe(() => this.feed.sync(this.bmsRequestContext(), true));
  }

  /** Everything the navigation rules may look at — nothing else decides visibility. */
  navContext(): NavContext {
    return {
      user: this.session.currentUser || {},
      isManager: this.session.isManager,
      isAdmin: this.session.isAdmin,
      permissionIds: (this.session.userPerms || []).map(permission => permission.permission_id),
      moduleEnabled: slug => this.modules.isModuleEnabled(slug),
      abilities: this.abilities || [],
    };
  }

  private resolveNavigation(): void {
    this.groups = visibleGroups(NAV_GROUPS, this.navContext());
    this.resolveActive();
  }

  private resolveActive(): void {
    const url = normalizeUrl(this.router.url);
    this.translatedContent = AppShellComponent.isBmsUrl(url);
    const active = activeNav(this.groups, url);
    if (active) {
      this.activeGroupId = active.group.id;
      this.activeItemId = active.item.id;
      this.groupLabel = active.group.label;
      this.pageLabel = active.item.label;
      return;
    }
    // A page that is not (or not visibly) a sidebar entry: keep the section context when it is known.
    const known = activeNav(NAV_GROUPS, url);
    const extra = NAV_EXTRA_TITLES.find(title => url === title.prefix || url.startsWith(`${title.prefix}/`));
    this.activeGroupId = '';
    this.activeItemId = '';
    this.groupLabel = !extra && known ? known.group.label : '';
    this.pageLabel = extra ? extra.label : (known ? known.item.label : '');
  }

  /** `department == TECHNICAL_TEAM && accPosition != MANAGER` — the legacy rule of the "Open To Work" button. */
  get showOpenToWork(): boolean {
    const user = this.session.currentUser || {};
    return user.department == Department.TECHNICAL_TEAM && user.accPosition != AccountPositions.MANAGER;
  }

  openToWork(): void { this.openToWorkDialog?.getMyOpenToWork(); }

  setCollapsed(collapsed: boolean): void {
    this.collapsePreference = collapsed;
    this.collapsed = collapsed;
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); } catch (_error) { /* storage unavailable */ }
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  @HostListener('window:resize') onResize(): void {
    const width = AppShellComponent.viewportWidth();
    this.mobile = width < SHELL_MOBILE_BREAKPOINT;
    this.compact = width < SHELL_COMPACT_BREAKPOINT;
    this.collapsed = AppShellComponent.resolveCollapsed(this.collapsePreference, width);
    if (!this.mobile) this.menuOpen = false;
  }

  @HostListener('document:keydown.escape') onEscape(): void { this.closeMenu(); }

  private static isBmsUrl(url: string): boolean {
    const clean = normalizeUrl(url);
    return clean === '/bms' || clean.startsWith('/bms/');
  }

  private static viewportWidth(): number { return typeof window !== 'undefined' ? window.innerWidth : 1440; }

  /** An explicit preference always wins; without one, narrow desktops (992-1279px) start as an icon rail. */
  static resolveCollapsed(preference: boolean | null, width: number): boolean {
    if (preference !== null) return preference;
    return width >= SHELL_MOBILE_BREAKPOINT && width < SHELL_WIDE_BREAKPOINT;
  }

  private static readCollapsed(): boolean | null {
    try {
      const stored = localStorage.getItem(COLLAPSE_KEY);
      return stored === '1' ? true : stored === '0' ? false : null;
    } catch (_error) { return null; }
  }
}
