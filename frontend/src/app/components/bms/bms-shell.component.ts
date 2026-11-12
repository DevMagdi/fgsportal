import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BmsAccessService } from './bms-access.service';
import { BmsApiService } from './bms-api.service';
import { BmsLanguageService } from './bms-language.service';
import { BMS_NAVIGATION_GROUPS, BmsNavigationGroup, BmsNavigationLink, BmsNavigationState } from './bms-navigation';

/** The six-category BMS application shell. Links remain ability-gated. */
@Component({ selector: 'app-bms-shell', templateUrl: './bms-shell.component.html', styleUrls: ['./bms-shared.scss', './bms-shell.component.scss'] })
export class BmsShellComponent implements OnInit, OnDestroy {
  readonly groups = BMS_NAVIGATION_GROUPS;
  readonly navigation = new BmsNavigationState();
  direction: 'ltr' | 'rtl' = this.lang.direction;
  alerts: any[] = [];
  notifications: any[] = [];
  showAlerts = false;
  menuOpen = false;
  isMobile = typeof window !== 'undefined' && window.innerWidth <= 980;
  lookups: any = { can: [] };
  lookupsLoading = true;
  lookupsError = '';
  alertsLoading = false;
  alertsError = '';
  notificationsLoading = false;
  notificationsError = '';
  noticeSuccess = '';

  private languageSub: Subscription;
  private routerSub: Subscription;

  constructor(
    public lang: BmsLanguageService,
    private api: BmsApiService,
    private access: BmsAccessService,
    private router: Router,
  ) {
    // Direction is applied only to the BMS workspace element, never <html>.
    this.languageSub = this.lang.language$.subscribe(() => this.direction = this.lang.direction);
  }

  ngOnInit(): void {
    this.navigation.expandForPath(this.router.url);
    this.load();
    this.routerSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.navigation.expandForPath(this.router.url);
      this.menuOpen = false;
      this.showAlerts = false;
    });
  }

  load(): void {
    this.lookupsLoading = true;
    this.lookupsError = '';
    this.api.get<any>('lookups').subscribe({
      next: data => {
        this.lookups = data || { can: [] };
        this.lookupsLoading = false;
        this.access.reset();
        if (this.lookups.can) this.access.abilities().subscribe();
        if ((this.lookups.can || []).includes('opportunities.view')) this.loadAlerts();
        this.loadNotifications();
      },
      error: () => {
        // No links are shown until capabilities are available; server guards remain authoritative.
        this.lookups = { can: [] };
        this.lookupsLoading = false;
        this.lookupsError = this.lang.t('navigationLoadError');
      },
    });
  }

  can(ability: string): boolean { return (this.lookups.can || []).includes(ability); }
  linksFor(group: BmsNavigationGroup): BmsNavigationLink[] { return this.navigation.visibleLinks(group, this.lookups.can || []); }
  toggleGroup(groupId: string): void { this.navigation.toggle(groupId); }
  groupExpanded(groupId: string): boolean { return this.navigation.isExpanded(groupId); }

  isActive(link: BmsNavigationLink): boolean {
    return this.navigation.linkForPath(this.router.url)?.path === link.path;
  }

  isGroupActive(groupId: string): boolean {
    return this.navigation.groupForPath(this.router.url)?.id === groupId;
  }

  currentTitleKey(): string {
    return this.navigation.linkForPath(this.router.url)?.label || (this.router.url.includes('no-access') ? 'noAccessTitle' : 'bms');
  }

  currentCategoryKey(): string {
    return this.navigation.groupForPath(this.router.url)?.label || '';
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }
  toggleAlerts(): void { this.showAlerts = !this.showAlerts; this.noticeSuccess = ''; }

  loadAlerts(): void {
    this.alertsLoading = true;
    this.alertsError = '';
    this.api.get<any[]>('alerts').subscribe({
      next: data => { this.alerts = data || []; this.alertsLoading = false; },
      error: () => { this.alertsLoading = false; this.alertsError = this.lang.t('alertsLoadError'); },
    });
  }

  loadNotifications(): void {
    this.notificationsLoading = true;
    this.notificationsError = '';
    this.api.get<any>('notifications').subscribe({
      next: data => { this.notifications = data?.data || []; this.notificationsLoading = false; },
      error: () => { this.notificationsLoading = false; this.notificationsError = this.lang.t('notificationsLoadError'); },
    });
  }

  readNotification(notification: any): void {
    this.api.put(`notifications/${notification.id}/read`, {}).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(item => item.id !== notification.id);
        this.noticeSuccess = this.lang.t('markedAsRead');
      },
      error: () => this.notificationsError = this.lang.t('updateFailed'),
    });
  }

  read(alert: any): void {
    this.api.put(`alerts/${alert.id}/read`, {}).subscribe({
      next: () => {
        this.alerts = this.alerts.filter(item => item.id !== alert.id);
        this.noticeSuccess = this.lang.t('markedAsRead');
      },
      error: () => this.alertsError = this.lang.t('updateFailed'),
    });
  }

  @HostListener('window:resize') onResize(): void {
    this.isMobile = window.innerWidth <= 980;
    if (!this.isMobile) this.menuOpen = false;
  }

  @HostListener('document:keydown.escape') onEscape(): void {
    if (this.isMobile) this.closeMenu();
    this.showAlerts = false;
  }

  ngOnDestroy(): void {
    this.languageSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }
}
