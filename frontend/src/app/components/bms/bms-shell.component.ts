import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BmsAccessService } from './bms-access.service';
import { BmsApiService } from './bms-api.service';
import { BmsLanguageService } from './bms-language.service';

interface NavLink { path: string; label: string; ability: string; icon: string }
interface NavGroup { label: string; links: NavLink[]; visible: () => boolean }

/**
 * The single BMS application shell (BRD section 4). Navigation is grouped by
 * business area instead of listing every workflow flat, and each link is only
 * rendered when the signed-in user actually holds the matching ability.
 */
@Component({ selector: 'app-bms-shell', templateUrl: './bms-shell.component.html', styleUrls: ['./bms-shared.scss'] })
export class BmsShellComponent implements OnInit, OnDestroy {
  direction: 'ltr' | 'rtl' = this.lang.direction;
  alerts: any[] = [];
  notifications: any[] = [];
  showAlerts = false;
  menuOpen = false;
  lookups: any = { can: [] };
  private subscription = this.lang.language$.subscribe(() => {
    this.direction = this.lang.direction;
    document.documentElement.dir = this.direction;
  });
  private routerSub: Subscription;

  /** Grouped navigation: groups, not separately "purchased" modules. */
  groups: NavGroup[] = [
    { label: 'grpOverview', visible: () => this.any(['dashboard.view', 'reports.view']), links: [
      { path: 'dashboard', label: 'dashboard', ability: 'dashboard.view', icon: 'bx-bar-chart-alt-2' },
      { path: 'reports', label: 'reports', ability: 'reports.view', icon: 'bx-file' },
    ] },
    { label: 'grpOrganization', visible: () => this.any(['units.view', 'directory.view', 'roles.manage']), links: [
      { path: 'units', label: 'units', ability: 'units.view', icon: 'bx-buildings' },
      { path: 'employees', label: 'employees', ability: 'directory.view', icon: 'bx-id-card' },
      { path: 'access', label: 'accessRoles', ability: 'roles.manage', icon: 'bx-shield-quarter' },
    ] },
    { label: 'grpExecution', visible: () => this.any(['plans.view', 'development.view', 'products.view']), links: [
      { path: 'plans', label: 'plans', ability: 'plans.view', icon: 'bx-calendar-check' },
      { path: 'my-tasks', label: 'myTasks', ability: 'plans.view', icon: 'bx-task' },
      { path: 'development', label: 'development', ability: 'development.view', icon: 'bx-trending-up' },
      { path: 'products', label: 'products', ability: 'products.view', icon: 'bx-package' },
    ] },
    { label: 'grpBusinessDev', visible: () => this.any(['leads.view', 'opportunities.view']), links: [
      { path: 'leads', label: 'leads', ability: 'leads.view', icon: 'bx-network-chart' },
      { path: 'opportunities', label: 'opportunities', ability: 'opportunities.view', icon: 'bx-briefcase' },
    ] },
    { label: 'grpOperations', visible: () => this.any(['meetings.view', 'procurement.view', 'events.view', 'documents.view']), links: [
      { path: 'meetings', label: 'meetings', ability: 'meetings.view', icon: 'bx-calendar' },
      { path: 'procurement', label: 'procurement', ability: 'procurement.view', icon: 'bx-cart' },
      { path: 'events', label: 'events', ability: 'events.view', icon: 'bx-calendar-star' },
      { path: 'documents', label: 'documents', ability: 'documents.view', icon: 'bx-folder-open' },
    ] },
    { label: 'grpPeople', visible: () => this.any(['recruitment.view']), links: [
      { path: 'recruitment', label: 'recruitment', ability: 'recruitment.view', icon: 'bx-user-plus' },
    ] },
  ];

  constructor(public lang: BmsLanguageService, private api: BmsApiService, private access: BmsAccessService, private router: Router) {}

  ngOnInit(): void {
    this.load();
    this.routerSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.menuOpen = false);
  }

  private load(): void {
    this.api.get<any>('lookups').subscribe({
      next: data => {
        this.lookups = data;
        this.access.reset();
        if (data.can) { this.access.abilities().subscribe(); }
        if ((data.can || []).includes('opportunities.view')) this.loadAlerts();
        this.loadNotifications();
      },
      error: () => {},
    });
  }

  can(ability: string): boolean { return (this.lookups.can || []).includes(ability); }
  any(abilities: string[]): boolean { return abilities.some(ability => this.can(ability)); }
  currentTitleKey(): string {
    const url = this.router.url.split('?')[0];
    const all = this.groups.reduce((links: NavLink[], group) => links.concat(group.links), []);
    const match = all.find(link => url.indexOf('/bms/' + link.path) === 0);
    return match ? match.label : 'dashboard';
  }
  loadAlerts(): void { this.api.get<any[]>('alerts').subscribe({ next: data => this.alerts = data, error: () => {} }); }
  loadNotifications(): void { this.api.get<any>('notifications').subscribe({ next: data => this.notifications = data.data || [], error: () => {} }); }
  readNotification(notification: any): void { this.api.put(`notifications/${notification.id}/read`, {}).subscribe({ next: () => { this.notifications = this.notifications.filter(item => item.id !== notification.id); }, error: () => {} }); }
  read(alert: any): void { this.api.put(`alerts/${alert.id}/read`, {}).subscribe({ next: () => { this.alerts = this.alerts.filter(a => a.id !== alert.id); }, error: () => {} }); }
  ngOnDestroy(): void { this.subscription.unsubscribe(); this.routerSub?.unsubscribe(); document.documentElement.dir = 'ltr'; }
}
