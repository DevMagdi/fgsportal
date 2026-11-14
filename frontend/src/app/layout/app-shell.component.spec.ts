import { Router } from '@angular/router';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { BmsAccessService } from '../components/bms/bms-access.service';
import { BmsLanguageService } from '../components/bms/bms-language.service';
import { AccountPositions, Department } from '../interfaces/user';
import { ModuleService } from '../services/module.service';
import { AppShellComponent } from './app-shell.component';
import { BmsFeedService } from './bms-feed.service';
import { EMPTY_NAV_COUNTERS } from './navigation/nav.model';
import { ShellSessionService } from './shell-session.service';

describe('AppShellComponent', () => {
  let language: BmsLanguageService;
  let router: any;
  let events: Subject<any>;
  let session: any;
  let access: any;
  let abilities$: BehaviorSubject<string[] | null>;
  let modules: any;
  let enabledModules$: BehaviorSubject<string[]>;
  let shell: AppShellComponent;
  let api: any;
  let feed: BmsFeedService;
  const build = () => new AppShellComponent(language, session as ShellSessionService, access as BmsAccessService, modules as ModuleService, feed, router as Router);
  const requested = () => api.get.calls.allArgs().map((args: any[]) => args[0]);
  let originalDirection: string;

  beforeEach(() => {
    localStorage.removeItem('ui-sidebar-collapsed');
    localStorage.removeItem('bms-language');
    language = new BmsLanguageService();
    events = new Subject<any>();
    router = { url: '/bms/development', events };
    session = {
      currentUser: {}, userPerms: [], isManager: false, isAdmin: false, counters: { ...EMPTY_NAV_COUNTERS },
      changes$: new BehaviorSubject<number>(0),
      start: jasmine.createSpy('start'), stop: jasmine.createSpy('stop'),
    };
    abilities$ = new BehaviorSubject<string[] | null>(null);
    const loadFailed$ = new BehaviorSubject<boolean>(false);
    // Like the real service: a refresh publishes the server answer before it completes.
    let serverAbilities: string[] = [];
    access = {
      abilities$, loadFailed$,
      answerWith: (list: string[]) => serverAbilities = list,
      refresh: jasmine.createSpy('refresh').and.callFake(() => { abilities$.next(serverAbilities); return of(serverAbilities); }),
    };
    api = { get: jasmine.createSpy('get').and.returnValue(of({ data: [] })), put: jasmine.createSpy('put').and.returnValue(of({})) };
    feed = new BmsFeedService(api);
    enabledModules$ = new BehaviorSubject<string[]>(['bms']);
    modules = { enabledModules$, isModuleEnabled: (slug: string) => enabledModules$.value.includes(slug) };
    originalDirection = document.documentElement.getAttribute('dir') || '';
    shell = build();
    shell.ngOnInit();
  });

  afterEach(() => {
    shell.ngOnDestroy();
    if (originalDirection) document.documentElement.setAttribute('dir', originalDirection);
    else document.documentElement.removeAttribute('dir');
  });

  it('starts the extracted session responsibilities and stops them with the shell', () => {
    expect(session.start).toHaveBeenCalledTimes(1);
    shell.ngOnDestroy();
    expect(session.stop).toHaveBeenCalled();
  });

  it('scopes language direction to the shell and leaves the document direction untouched', () => {
    document.documentElement.setAttribute('dir', 'ltr');
    language.language$.next('ar');
    expect(shell.direction).toBe('rtl');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    language.language$.next('en');
    expect(shell.direction).toBe('ltr');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  it('shows no BMS link before abilities arrive and only permitted links afterwards', () => {
    expect(shell.groups.length).toBe(0);
    abilities$.next(['development.view', 'units.view']);
    const routes = shell.groups.reduce((all, group) => all.concat(group.items.map(item => item.route)), [] as string[]);
    expect(routes.sort()).toEqual(['/bms/development', '/bms/organization', '/bms/units']);
  });

  it('resolves active group, page label and breadcrumb context from the preserved route', () => {
    abilities$.next(['development.view']);
    expect(shell.activeGroupId).toBe('organization');
    expect(shell.groupLabel).toBe('grpOrganization');
    expect(shell.pageLabel).toBe('development');
    expect(shell.translatedContent).toBe(true);
  });

  it('keeps untranslated legacy pages out of the translated (RTL-capable) content mode', () => {
    router.url = '/manager/projects';
    events.next(new NavigationEnd(1, '/manager/projects', '/manager/projects'));
    expect(shell.translatedContent).toBe(false);
    expect(shell.pageLabel).toBe('navProjects');
    expect(shell.activeItemId).toBe('');
  });

  it('recomputes legacy navigation when session data or module entitlements change', () => {
    session.currentUser = { department: Department.MANAGEMENT };
    session.isManager = true;
    enabledModules$.next(['bms', 'admin']);
    session.changes$.next(1);
    const routes = shell.groups.reduce((all, group) => all.concat(group.items.map(item => item.route)), [] as string[]);
    expect(routes).toContain('/manager/addusers');
    expect(routes).toContain('/manager/config');
    expect(routes).not.toContain('/CRM/dashboard');
  });

  it('refreshes BMS abilities on start and again when the user re-enters the BMS workspace', () => {
    expect(access.refresh).toHaveBeenCalledTimes(1);
    router.url = '/manager/projects';
    events.next(new NavigationEnd(1, router.url, router.url));
    router.url = '/bms/plans';
    events.next(new NavigationEnd(2, router.url, router.url));
    expect(access.refresh).toHaveBeenCalledTimes(2);
    router.url = '/bms/units';
    events.next(new NavigationEnd(3, router.url, router.url));
    expect(access.refresh).toHaveBeenCalledTimes(2);
  });

  it('offers "Open To Work" under the legacy rule only', () => {
    session.currentUser = { department: Department.TECHNICAL_TEAM, accPosition: AccountPositions.SENIOR };
    expect(shell.showOpenToWork).toBe(true);
    session.currentUser = { department: Department.TECHNICAL_TEAM, accPosition: AccountPositions.MANAGER };
    expect(shell.showOpenToWork).toBe(false);
    session.currentUser = { department: Department.MANAGEMENT };
    expect(shell.showOpenToWork).toBe(false);
  });

  it('persists the collapsed state and closes the mobile drawer on navigation and Escape', () => {
    shell.setCollapsed(true);
    expect(localStorage.getItem('ui-sidebar-collapsed')).toBe('1');
    shell.setCollapsed(false);
    expect(localStorage.getItem('ui-sidebar-collapsed')).toBe('0');
    shell.toggleMenu();
    expect(shell.menuOpen).toBe(true);
    events.next(new NavigationEnd(4, router.url, router.url));
    expect(shell.menuOpen).toBe(false);
    shell.toggleMenu();
    shell.onEscape();
    expect(shell.menuOpen).toBe(false);
  });

  describe('BMS requests from the global shell', () => {
    function restart(url: string, enabled: string[], serverAbilities: string[]): void {
      shell.ngOnDestroy();
      access.refresh.calls.reset();
      api.get.calls.reset();
      abilities$.next(null);
      router.url = url;
      enabledModules$.next(enabled);
      access.answerWith(serverAbilities);
      shell = build();
      shell.ngOnInit();
    }

    function navigate(url: string): void {
      router.url = url;
      events.next(new NavigationEnd(9, url, url));
    }

    it('asks BMS nothing on a legacy page when the company does not own the BMS module', () => {
      restart('/manager/projects', ['projects', 'hr'], ['opportunities.view']);
      expect(access.refresh).not.toHaveBeenCalled();
      expect(requested()).toEqual([]);
      expect(shell.abilitiesLoading).toBe(false);
      navigate('/hr/vacations');
      expect(access.refresh).not.toHaveBeenCalled();
      expect(requested()).toEqual([]);
    });

    it('asks only for abilities on a legacy page when the user holds no BMS ability', () => {
      restart('/manager/projects', ['bms', 'projects'], []);
      expect(access.refresh).toHaveBeenCalledTimes(1);
      expect(requested()).toEqual([]);
    });

    it('loads notifications but not alerts for a BMS user without opportunities.view', () => {
      restart('/manager/projects', ['bms'], ['units.view']);
      expect(requested()).toEqual(['notifications']);
    });

    it('loads alerts and notifications once for an eligible user, and not again on legacy navigation', () => {
      restart('/manager/projects', ['bms'], ['opportunities.view']);
      expect(requested().sort()).toEqual(['alerts', 'notifications']);
      navigate('/CRM/dashboard');
      navigate('/notes');
      expect(requested().length).toBe(2);
      expect(access.refresh).toHaveBeenCalledTimes(1);
    });

    it('never requests alerts or notifications when the abilities request failed', () => {
      restart('/manager/projects', ['bms'], ['opportunities.view']);
      api.get.calls.reset();
      access.loadFailed$.next(true);
      navigate('/bms/plans');
      expect(access.refresh).toHaveBeenCalledTimes(2);
      expect(requested()).toEqual([]);
      access.loadFailed$.next(false);
    });

    it('inside BMS behaves like the retired BMS shell: abilities, then notifications even without abilities', () => {
      restart('/bms/no-access', [], []);
      expect(access.refresh).toHaveBeenCalledTimes(1);
      expect(requested()).toEqual(['notifications']);
      feed.notifications = [{ id: 1 }];
      navigate('/manager/projects');
      expect(feed.notifications).toEqual([]);
      expect(requested().length).toBe(1);
    });

    it('starts BMS requests when the entitlement list arrives after the shell', () => {
      restart('/manager/projects', [], ['opportunities.view']);
      expect(access.refresh).not.toHaveBeenCalled();
      enabledModules$.next(['bms']);
      expect(access.refresh).toHaveBeenCalledTimes(1);
      expect(requested().sort()).toEqual(['alerts', 'notifications']);
      enabledModules$.next(['bms', 'crm']);
      expect(access.refresh).toHaveBeenCalledTimes(1);
      expect(requested().length).toBe(2);
    });

    it('forgets BMS alerts and notifications when the session ends', () => {
      restart('/bms/dashboard', ['bms'], ['opportunities.view']);
      feed.alerts = [{ id: 1 }];
      shell.ngOnDestroy();
      expect(feed.alerts).toEqual([]);
      expect(feed.canLoadAlerts).toBe(false);
      feed.loadAlerts();
      expect(requested().length).toBe(2);
    });
  });
});
