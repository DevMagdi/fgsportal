import { Injectable } from '@angular/core';
import { BmsApiService } from '../components/bms/bms-api.service';
import { BmsRequestContext, shouldLoadBmsAlerts, shouldLoadBmsNotifications } from './bms-requests.policy';

/**
 * BMS opportunity alerts and BMS notifications shown in the global header
 * (previously loaded by the BMS shell). Requests are issued only through
 * `sync()`, which applies the request policy; the header merely displays.
 */
@Injectable({ providedIn: 'root' })
export class BmsFeedService {
  alerts: any[] = [];
  notifications: any[] = [];
  alertsLoading = false;
  notificationsLoading = false;
  /** Translation keys ('' when there is no error). */
  alertsError = '';
  notificationsError = '';
  /** Translation key of the last success notice ('' when none). */
  notice = '';

  private alertsAllowed = false;
  private notificationsAllowed = false;
  /** Bumped whenever a list is dropped, so a late answer cannot repopulate it. */
  private alertsEpoch = 0;
  private notificationsEpoch = 0;

  constructor(private api: BmsApiService) {}

  get canLoadAlerts(): boolean { return this.alertsAllowed; }
  get canLoadNotifications(): boolean { return this.notificationsAllowed; }

  /**
   * Apply the policy to the current context. Lists the user is no longer
   * eligible for are dropped. With `request`, eligible lists are (re)loaded;
   * without it nothing is requested.
   */
  sync(context: BmsRequestContext, request: boolean): void {
    this.alertsAllowed = shouldLoadBmsAlerts(context);
    this.notificationsAllowed = shouldLoadBmsNotifications(context);
    if (!this.alertsAllowed) this.dropAlerts();
    else if (request) this.loadAlerts();
    if (!this.notificationsAllowed) this.dropNotifications();
    else if (request) this.loadNotifications();
  }

  /** Forget everything (session end). */
  clear(): void {
    this.alertsAllowed = false;
    this.notificationsAllowed = false;
    this.dropAlerts();
    this.dropNotifications();
    this.notice = '';
  }

  loadAlerts(): void {
    if (!this.alertsAllowed) return;
    const epoch = ++this.alertsEpoch;
    this.alertsLoading = true;
    this.alertsError = '';
    this.api.get<any[]>('alerts').subscribe({
      next: data => { if (epoch === this.alertsEpoch) { this.alerts = data || []; this.alertsLoading = false; } },
      error: () => { if (epoch === this.alertsEpoch) { this.alertsLoading = false; this.alertsError = 'alertsLoadError'; } },
    });
  }

  loadNotifications(): void {
    if (!this.notificationsAllowed) return;
    const epoch = ++this.notificationsEpoch;
    this.notificationsLoading = true;
    this.notificationsError = '';
    this.api.get<any>('notifications').subscribe({
      next: data => { if (epoch === this.notificationsEpoch) { this.notifications = data?.data || []; this.notificationsLoading = false; } },
      error: () => { if (epoch === this.notificationsEpoch) { this.notificationsLoading = false; this.notificationsError = 'notificationsLoadError'; } },
    });
  }

  readAlert(alert: any): void {
    this.api.put(`alerts/${alert.id}/read`, {}).subscribe({
      next: () => { this.alerts = this.alerts.filter(item => item.id !== alert.id); this.notice = 'markedAsRead'; },
      error: () => this.alertsError = 'updateFailed',
    });
  }

  readNotification(notification: any): void {
    this.api.put(`notifications/${notification.id}/read`, {}).subscribe({
      next: () => { this.notifications = this.notifications.filter(item => item.id !== notification.id); this.notice = 'markedAsRead'; },
      error: () => this.notificationsError = 'updateFailed',
    });
  }

  private dropAlerts(): void {
    this.alertsEpoch++;
    this.alerts = [];
    this.alertsLoading = false;
    this.alertsError = '';
  }

  private dropNotifications(): void {
    this.notificationsEpoch++;
    this.notifications = [];
    this.notificationsLoading = false;
    this.notificationsError = '';
  }
}
