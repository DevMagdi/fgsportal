import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { BmsLanguageService } from '../../components/bms/bms-language.service';
import { Notifying } from '../../interfaces/notification';
import { AccountType } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { BmsFeedService } from '../bms-feed.service';
import { ShellSessionService } from '../shell-session.service';

/**
 * The one and only application header: menu toggle, breadcrumbs and page
 * title, one notification centre (legacy realtime notifications + BMS alerts
 * and notifications), language switch and the account menu.
 */
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  /** Translation key of the current navigation group ('' when unknown). */
  @Input() groupLabel = '';
  /** Translation key of the current page ('' when unknown). */
  @Input() pageLabel = '';
  @Input() mobile = false;
  @Input() menuOpen = false;
  /** Narrow viewport: text labels of the action buttons are not rendered. */
  @Input() compact = false;
  @Output() menuToggle = new EventEmitter<void>();

  readonly newServerApi = environment.newServerApi;

  showNotifications = false;
  showUserMenu = false;

  constructor(
    public lang: BmsLanguageService,
    public session: ShellSessionService,
    /** BMS alerts and notifications; loaded by the shell under the BMS request policy, only displayed here. */
    public feed: BmsFeedService,
    private host: ElementRef<HTMLElement>,
  ) {}

  /* ---- legacy realtime notifications ----------------------------------- */
  get unread(): Notifying[] { return this.session.getunreadnotification(); }

  /** As before: the four newest unread, or the four newest when nothing is unread. */
  get latestLegacy(): Notifying[] {
    const source = this.unread.length > 0 ? this.unread : this.session.myNotifications;
    return source.slice().reverse().slice(0, 4);
  }

  get badgeCount(): number { return this.unread.length + this.alerts.length + this.notifications.length; }

  getTime(dateString: any): string {
    const timestamp = Date.parse(dateString);
    return moment(moment.unix(timestamp / 1000)).startOf('minute').fromNow();
  }

  openLegacy(notify: Notifying): void {
    this.showNotifications = false;
    this.session.readThisNotify(notify);
  }

  /* ---- BMS alerts / notifications -------------------------------------- */
  get alerts(): any[] { return this.feed.alerts; }
  get notifications(): any[] { return this.feed.notifications; }
  get alertsLoading(): boolean { return this.feed.alertsLoading; }
  get notificationsLoading(): boolean { return this.feed.notificationsLoading; }
  get alertsError(): string { return this.feed.alertsError ? this.lang.t(this.feed.alertsError) : ''; }
  get notificationsError(): string { return this.feed.notificationsError ? this.lang.t(this.feed.notificationsError) : ''; }
  get noticeSuccess(): string { return this.feed.notice ? this.lang.t(this.feed.notice) : ''; }

  loadAlerts(): void { this.feed.loadAlerts(); }
  loadNotifications(): void { this.feed.loadNotifications(); }
  readNotification(notification: any): void { this.feed.readNotification(notification); }
  read(alert: any): void { this.feed.readAlert(alert); }

  /* ---- account ---------------------------------------------------------- */
  get user(): any { return this.session.currentUser || {}; }

  /** The legacy navbar offered the profile link to every non-client account. */
  get canViewProfile(): boolean { return this.user.accType != AccountType.Client; }

  get avatar(): string {
    if (this.user.photoURL) return `${this.newServerApi}${this.user.photoURL}`;
    return this.user.gender == 'female' ? 'assets/img/girlmyavatar.png' : 'assets/img/avatarman.png';
  }

  logout(): void {
    this.showUserMenu = false;
    this.session.logout();
  }

  /* ---- panels ----------------------------------------------------------- */
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
    this.feed.notice = '';
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  closePanels(): void {
    this.showNotifications = false;
    this.showUserMenu = false;
  }

  @HostListener('document:keydown.escape') onEscape(): void { this.closePanels(); }

  @HostListener('document:click', ['$event.target']) onDocumentClick(target: EventTarget | null): void {
    if ((this.showNotifications || this.showUserMenu) && target instanceof Node && !this.host.nativeElement.contains(target)) {
      this.closePanels();
    }
  }

  trackById(index: number, item: any): string | number { return item?.id ?? item?.key ?? index; }
}
