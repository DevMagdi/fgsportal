import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { NotificationStatus } from '../interfaces/notification';
import { ResStatus } from '../interfaces/res-status';
import { AccountPositions, Department } from '../interfaces/user';
import { SnackBarState } from '../components/snackbar/snackbar.component';
import { ShellSessionService } from './shell-session.service';

/** The responsibilities moved out of the retired NavbarComponent, exercised one by one. */
describe('ShellSessionService (former NavbarComponent responsibilities)', () => {
  let user$: BehaviorSubject<any>;
  let auth: any;
  let router: any;
  let db: any;
  let notify: any;
  let message: any;
  let navParams$: Subject<any>;
  let notifications$: Subject<any[]>;
  let service: ShellSessionService;
  let hadUserData: string | null;

  const ok = (data: any) => of({ status: ResStatus.CRUD, data });
  const expired = { status: ResStatus.Forbidden, message: 'Token is Expired' };

  beforeEach(() => {
    hadUserData = localStorage.getItem('userData');
    // Without it the service (like the navbar) reloads the page.
    localStorage.setItem('userData', '{}');
    user$ = new BehaviorSubject<any>(null);
    navParams$ = new Subject<any>();
    notifications$ = new Subject<any[]>();
    auth = {
      user: user$,
      getCurrentLoggedInUser: jasmine.createSpy('getCurrentLoggedInUser').and.callFake(() => ok({ key: 'u1', username: 'server-name', department: Department.MANAGEMENT })),
      getUserPermissionsByKey: jasmine.createSpy('getUserPermissionsByKey').and.callFake(() => ok([{ permission_id: 5 }])),
      restoreCachedPerms: jasmine.createSpy('restoreCachedPerms').and.returnValue([{ permission_id: 13 }]),
      getNavPermsByUserID: jasmine.createSpy('getNavPermsByUserID').and.returnValue(navParams$),
      updateNavPerms: jasmine.createSpy('updateNavPerms').and.returnValue(new Promise(() => undefined)),
      logout: jasmine.createSpy('logout'),
    };
    router = { navigate: jasmine.createSpy('navigate'), navigateByUrl: jasmine.createSpy('navigateByUrl') };
    db = {
      getMyAnnounceToView: jasmine.createSpy('getMyAnnounceToView').and.callFake(() => ok([{ key: 'a1', title: 'Hello' }])),
      announceMarkAsView: jasmine.createSpy('announceMarkAsView').and.returnValue(of({})),
    };
    notify = { openSnackbar: jasmine.createSpy('openSnackbar') };
    message = {
      getNotificationByUser: jasmine.createSpy('getNotificationByUser').and.returnValue(notifications$),
      updateNotification: jasmine.createSpy('updateNotification').and.returnValue(Promise.resolve()),
    };
    service = new ShellSessionService(auth, router, db, notify, message);
  });

  afterEach(() => {
    service.stop();
    if (hadUserData === null) localStorage.removeItem('userData');
    else localStorage.setItem('userData', hadUserData);
  });

  const signIn = (user: any = { key: 'u1', username: 'local-name', department: Department.MANAGEMENT }) => { service.start(); user$.next(user); };

  it('does nothing until a user is signed in (auto-login feeds the same user stream)', () => {
    service.start();
    expect(auth.getCurrentLoggedInUser).not.toHaveBeenCalled();
    expect(service.isLoggedIn).toBe(false);
    user$.next({ key: 'u1', username: 'x' });
    expect(service.isLoggedIn).toBe(true);
    expect(auth.getCurrentLoggedInUser).toHaveBeenCalledTimes(1);
  });

  it('validates the session with the server and adopts the server copy of the user', () => {
    signIn();
    expect(service.currentUserKey).toBe('u1');
    expect(service.currentUser.username).toBe('server-name');
  });

  it('forces a logout with the original message when the server says the token expired', () => {
    auth.getCurrentLoggedInUser.and.returnValue(of(expired));
    localStorage.setItem('bms-language', 'ar');
    signIn();
    expect(notify.openSnackbar).toHaveBeenCalledWith('Session Expired , Please Relogin', SnackBarState.Warning);
    expect(auth.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(localStorage.getItem('bms-language')).toBeNull();
    expect(service.isLoggedIn).toBe(false);
  });

  it('forces a logout when validation fails with an expired-token error response', () => {
    auth.getCurrentLoggedInUser.and.returnValue(throwError({ error: expired }));
    signIn();
    expect(notify.openSnackbar).toHaveBeenCalledWith('Session Expired , Please Relogin', SnackBarState.Warning);
    expect(auth.logout).toHaveBeenCalled();
  });

  it('does not log out on other validation errors', () => {
    auth.getCurrentLoggedInUser.and.returnValue(throwError({ error: { status: 500 } }));
    signIn();
    expect(auth.logout).not.toHaveBeenCalled();
  });

  it('loads the permission list, and forces a logout when that request reports an expired token', () => {
    signIn();
    expect(auth.getUserPermissionsByKey).toHaveBeenCalledWith('u1');
    expect(service.checkIfHasPerm(5)).toBe(true);
    expect(service.checkIfHasPerm('5')).toBe(true);
    expect(service.checkIfHasPerm(6)).toBe(false);

    auth.getUserPermissionsByKey.and.returnValue(of(expired));
    user$.next({ key: 'u1' });
    expect(auth.logout).toHaveBeenCalled();
  });

  it('empties the permission list on any other answer and falls back to the cache on a network error', () => {
    auth.getUserPermissionsByKey.and.returnValue(of({ status: 999 }));
    signIn();
    expect(service.userPerms).toEqual([]);

    auth.getUserPermissionsByKey.and.returnValue(throwError({ error: {} }));
    user$.next({ key: 'u1' });
    expect(auth.restoreCachedPerms).toHaveBeenCalled();
    expect(service.checkIfHasPerm(13)).toBe(true);
    expect(auth.logout).not.toHaveBeenCalled();
  });

  it('classifies manager and admin accounts exactly like the navbar', () => {
    signIn({ key: 'u1', department: Department.MANAGEMENT });
    expect([service.isManager, service.isAdmin]).toEqual([true, false]);
    user$.next({ key: 'u1', department: Department.TECHNICAL_TEAM, accPosition: AccountPositions.MANAGER });
    expect([service.isManager, service.isAdmin]).toEqual([true, false]);
    user$.next({ key: 'u1', department: Department.TECHNICAL_TEAM, accPosition: AccountPositions.SENIOR });
    expect([service.isManager, service.isAdmin]).toEqual([false, false]);
    user$.next({ key: 'u1', department: Department.ADMINSTRATION });
    expect([service.isManager, service.isAdmin]).toEqual([false, true]);
    user$.next({ key: 'u1', department: Department.Business_Development });
    expect([service.isManager, service.isAdmin]).toEqual([false, false]);
  });

  it('picks an announcement to display and marks it as viewed', () => {
    signIn();
    expect(service.runningAnnounces.length).toBe(1);
    expect(service.displayAnnounce).toBe(true);
    expect(service.announceToDisplay.key).toBe('a1');
    service.markAsView();
    expect(db.announceMarkAsView).toHaveBeenCalledWith('a1');
  });

  it('shows no announcement when the request fails or returns nothing usable', () => {
    db.getMyAnnounceToView.and.returnValue(throwError(new Error('offline')));
    signIn();
    expect(service.runningAnnounces).toEqual([]);
    expect(service.displayAnnounce).toBe(false);
  });

  it('keeps the navigation counters live with the navbar formulas', () => {
    signIn();
    navParams$.next({ open_to_work_counter: 2, pendingReport: 3, project_manager_reports: 4, pendingVacationsRequest: 5,
      pendingPublicRequest: 6, pendingTransportationRequest: 7, pendingIncentiveRequest: 8, myPendingPOCRequest: 9, myPendingRFPRequest: 10,
      rejectedReport: 11, devPendingReports: 12 });
    expect(service.counters.totalManageCounter).toBe(9);
    expect(service.counters.hrCounter).toBe(5);
    expect(service.counters.totalRequestsCounter).toBe(13);
    expect(service.counters.totalCRMReqsCounter).toBe(19);
    expect(service.counters.totalReports).toBe(23);
    navParams$.next({});
    expect(service.counters.totalManageCounter).toBe(0);
    expect(auth.updateNavPerms).not.toHaveBeenCalled();
  });

  it('acknowledges a refresh_required flag before reloading (the reload itself is not executed here)', () => {
    signIn();
    const params: any = { refresh_required: true };
    navParams$.next(params);
    expect(params.refresh_required).toBe(false);
    expect(auth.updateNavPerms).toHaveBeenCalledWith(params);
    expect(service.myNavParams).toBeUndefined();
  });

  it('receives realtime notifications, counts the unread ones, and marks one read before redirecting', async () => {
    signIn();
    expect(message.getNotificationByUser).toHaveBeenCalledWith('u1', 0);
    const unread = { status: NotificationStatus.unSeen, redirection: '/manager/reports' };
    notifications$.next([unread, { status: NotificationStatus.Seen }]);
    expect(service.myNotifications.length).toBe(2);
    expect(service.getunreadnotification()).toEqual([unread] as any);
    service.readThisNotify(unread);
    expect(unread.status).toBe(NotificationStatus.Seen);
    expect(message.updateNotification).toHaveBeenCalledWith(unread);
    await Promise.resolve();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/manager/reports');
  });

  it('logs out through AuthApiService, drops the language choice and returns to the root route', () => {
    signIn();
    localStorage.setItem('bms-language', 'ar');
    service.logout();
    expect(localStorage.getItem('bms-language')).toBeNull();
    expect(auth.logout).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(service.isLoggedIn).toBe(false);
  });

  it('stops listening and forgets the account when the shell goes away', () => {
    signIn();
    notifications$.next([{ status: NotificationStatus.unSeen }]);
    service.stop();
    expect(service.myNotifications).toEqual([]);
    expect(service.userPerms).toEqual([]);
    expect(service.currentUserKey).toBe('');
    notifications$.next([{ status: NotificationStatus.unSeen }]);
    navParams$.next({ pendingReport: 3 });
    expect(service.myNotifications).toEqual([]);
    expect(service.counters.totalManageCounter).toBe(0);
  });
});
