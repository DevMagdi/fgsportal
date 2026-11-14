import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Announcement } from '../interfaces/announcement';
import { NotificationStatus, Notifying } from '../interfaces/notification';
import { ResStatus } from '../interfaces/res-status';
import { AccountPositions, Department, User, UserNavParams } from '../interfaces/user';
import { UserPermissions } from '../interfaces/user-permissions';
import { AuthApiService } from '../services/auth-api.service';
import { DatabaseService } from '../services/database.service';
import { MessagingService } from '../services/messaging.service';
import { NotificationService } from '../services/notification.service';
import { SnackBarState } from '../components/snackbar/snackbar.component';
import { EMPTY_NAV_COUNTERS, NavCounters } from './navigation/nav.model';
import { countersFrom } from './navigation/nav.util';

/**
 * Session responsibilities extracted, unchanged, from the retired
 * `NavbarComponent` (which was the application layout, not just a navbar):
 *
 *  - server-side validation of the signed-in user and forced logout on
 *    "Token is Expired" (with the same snackbar);
 *  - hard reload when `userData` vanished from localStorage;
 *  - loading the legacy permission list that drives navigation;
 *  - announcements to display after sign-in and "mark as viewed";
 *  - realtime navigation counters, including the `refresh_required` reload;
 *  - realtime (Firebase) notifications and "mark as read + redirect";
 *  - the manager / admin classification used by navigation rules;
 *  - logout.
 *
 * The application shell starts it when it is created (i.e. when a user is
 * signed in) and stops it when it is destroyed — the lifetime the navbar had.
 */
@Injectable({ providedIn: 'root' })
export class ShellSessionService {
  isLoggedIn = false;
  username = '';
  currentUserKey = '';
  currentUser: User | any = {};
  userPerms: UserPermissions[] = [];
  isManager = false;
  isAdmin = false;
  myNavParams: UserNavParams | undefined;
  counters: NavCounters = { ...EMPTY_NAV_COUNTERS };
  myNotifications: Notifying[] = [];
  runningAnnounces: Announcement[] = [];
  announceToDisplay: Announcement | any;
  displayAnnounce = false;

  /** Emits after every state change so views can recompute derived data. */
  readonly changes$ = new BehaviorSubject<number>(0);

  private userSub: Subscription | undefined;
  private inner: Subscription[] = [];

  constructor(
    private _auth: AuthApiService,
    private router: Router,
    private _db: DatabaseService,
    private _notify: NotificationService,
    private message: MessagingService,
  ) {}

  private changed(): void { this.changes$.next(this.changes$.value + 1); }

  start(): void {
    if (this.userSub) return;
    this.userSub = this._auth.user.subscribe(
      (data) => {
        if (!!data) {
          this.clearInner();
          this.isLoggedIn = true;
          this.currentUser = data;
          this.username = this.currentUser.username;
          this.currentUserKey = this.currentUser.key || '';
          this.changed();

          const validation = this._auth.getCurrentLoggedInUser()?.subscribe(res => {
            if (res['status'] == ResStatus.CRUD) {
              this.currentUser = res['data'];
              this.changed();
            } else if (res['status'] == ResStatus.Forbidden && res['message'] == 'Token is Expired') {
              this._notify.openSnackbar('Session Expired , Please Relogin', SnackBarState.Warning);
              this.logout();
            }
          }, err => {
            console.log(err);
            if (err['error']?.['status'] == ResStatus.Forbidden && err['error']?.['message'] == 'Token is Expired') {
              this._notify.openSnackbar('Session Expired , Please Relogin', SnackBarState.Warning);
              this.logout();
            }
          });
          if (validation) this.inner.push(validation);

          if (!localStorage.getItem('userData')) {
            window.location.reload();
          }

          this.inner.push(this._auth.getUserPermissionsByKey(this.currentUser.key || '').subscribe(perms => {
            if (perms['status'] == ResStatus.CRUD) {
              this.userPerms = perms['data'];
            } else if (perms['status'] == ResStatus.Forbidden && perms['message'] == 'Token is Expired') {
              this._notify.openSnackbar('Session Expired , Please Relogin', SnackBarState.Warning);
              this.logout();
            } else {
              this.userPerms = [];
            }
            this.changed();
          }, err => {
            console.log(err);
            this.userPerms = this._auth.restoreCachedPerms();
            if (err['error']?.['status'] == ResStatus.Forbidden && err['error']?.['message'] == 'Token is Expired') {
              this._notify.openSnackbar('Session Expired , Please Relogin', SnackBarState.Warning);
              this.logout();
            }
            this.changed();
          }));

          this.getMyAnnounces();

          this.inner.push(this._auth.getNavPermsByUserID(this.currentUser.key || '').subscribe(res => {
            if (!!res.refresh_required) {
              res.refresh_required = false;
              this._auth.updateNavPerms(res).finally(() => {
                window.location.reload();
              });
            } else {
              this.myNavParams = res;
              this.counters = countersFrom(res);
              this.changed();
            }
          }));

          this.inner.push(this.message.getNotificationByUser(this.currentUser.key || '', 0).subscribe(
            (notifications) => {
              this.myNotifications = notifications;
              this.changed();
            }
          ));

          if (data.department == Department.MANAGEMENT || (data.department == Department.TECHNICAL_TEAM && data.accPosition == AccountPositions.MANAGER)) {
            this.isManager = true;
            this.isAdmin = false;
          } else if (data.department == Department.ADMINSTRATION) {
            this.isAdmin = true;
            this.isManager = false;
          } else {
            this.isManager = false;
            this.isAdmin = false;
          }
          this.changed();
        }
      },
      (err) => console.log(err)
    );
  }

  /** Ends the session view. State is dropped so a later sign-in never starts from the previous account's data (the navbar was re-created instead). */
  stop(): void {
    this.userSub?.unsubscribe();
    this.userSub = undefined;
    this.clearInner();
    this.isLoggedIn = false;
    this.username = '';
    this.currentUserKey = '';
    this.currentUser = {};
    this.userPerms = [];
    this.isManager = false;
    this.isAdmin = false;
    this.myNavParams = undefined;
    this.counters = { ...EMPTY_NAV_COUNTERS };
    this.myNotifications = [];
    this.runningAnnounces = [];
    this.announceToDisplay = undefined;
    this.displayAnnounce = false;
    this.changed();
  }

  private clearInner(): void {
    this.inner.forEach(sub => sub.unsubscribe());
    this.inner = [];
  }

  /** `checkIfHasPerm` of the navbar. */
  checkIfHasPerm(perm_id: any): boolean {
    return !!this.userPerms.find(p => p.permission_id == perm_id);
  }

  /* ---- announcements ---------------------------------------------------- */
  getMyAnnounces(): void {
    this.inner.push(this._db.getMyAnnounceToView().subscribe(res => {
      if (res['status'] == ResStatus.CRUD) {
        this.runningAnnounces = res['data'];
        this.displayNewAnnounce();
      } else {
        this.runningAnnounces = [];
      }
      this.changed();
    }, _err => {
      this.runningAnnounces = [];
      this.changed();
    }));
  }

  displayNewAnnounce(): void {
    this.displayAnnounce = true;
    const index = Math.floor(Math.random() * this.runningAnnounces.length);
    this.announceToDisplay = this.runningAnnounces[index];
  }

  markAsView(): void {
    this._db.announceMarkAsView(this.announceToDisplay?.key || '').subscribe();
  }

  /* ---- notifications ---------------------------------------------------- */
  getunreadnotification(): Notifying[] {
    return this.myNotifications.filter(notify => notify.status == NotificationStatus.unSeen);
  }

  readThisNotify(notify: Notifying | any): void {
    notify.status = NotificationStatus.Seen;
    this.message.updateNotification(notify).then(() => {
      this.router.navigateByUrl(notify.redirection);
    });
  }

  /* ---- logout ----------------------------------------------------------- */
  logout(): void {
    try { localStorage.removeItem('bms-language'); } catch (e) {}
    this._auth.logout();
    this.router.navigate(['/']);
    this.isLoggedIn = false;
    this.changed();
  }
}
