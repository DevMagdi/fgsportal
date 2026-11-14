import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { BmsAccessService } from '../components/bms/bms-access.service';
import { BmsApiService } from '../components/bms/bms-api.service';
import { Department } from '../interfaces/user';
import { AuthApiService } from '../services/auth-api.service';
import { DatabaseService } from '../services/database.service';
import { ModuleService } from '../services/module.service';
import { AppShellComponent } from './app-shell.component';
import { LayoutModule } from './layout.module';
import { EMPTY_NAV_COUNTERS } from './navigation/nav.model';
import { ShellSessionService } from './shell-session.service';

@Component({ template: '<section class="page-stub">page</section>' })
class PageStubComponent {}

/**
 * Renders the real shell (real sidebar, header and templates) around stub pages and counts the
 * navigation chrome in the DOM. Only data services are replaced; no layout piece is stubbed.
 */
describe('AppShellComponent (rendered DOM)', () => {
  let fixture: ComponentFixture<AppShellComponent>;
  let router: Router;
  let root: HTMLElement;
  let abilities$: BehaviorSubject<string[] | null>;
  let session: any;

  beforeEach(async () => {
    localStorage.setItem('ui-sidebar-collapsed', '0');
    localStorage.removeItem('bms-language');
    abilities$ = new BehaviorSubject<string[] | null>(['dashboard.view', 'units.view', 'opportunities.view']);
    session = {
      currentUser: { department: Department.MANAGEMENT, name: 'Test User', email: 't@example.test' }, currentUserKey: 'k1',
      userPerms: [], isManager: true, isAdmin: false, counters: { ...EMPTY_NAV_COUNTERS },
      myNotifications: [], runningAnnounces: [], announceToDisplay: null, displayAnnounce: false,
      changes$: new BehaviorSubject<number>(0),
      start: jasmine.createSpy('start'), stop: jasmine.createSpy('stop'), logout: jasmine.createSpy('logout'),
      getunreadnotification: () => [], readThisNotify: jasmine.createSpy('readThisNotify'), markAsView: jasmine.createSpy('markAsView'),
    };
    const enabled = ['bms', 'projects', 'crm', 'hr', 'admin', 'support'];
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule, LayoutModule,
        RouterTestingModule.withRoutes([
          { path: 'bms', children: [{ path: 'dashboard', component: PageStubComponent }, { path: 'units', component: PageStubComponent }] },
          { path: 'manager/projects', component: PageStubComponent },
          { path: 'notification', component: PageStubComponent },
        ]),
      ],
      declarations: [PageStubComponent],
      providers: [
        { provide: ShellSessionService, useValue: session },
        { provide: BmsAccessService, useValue: { abilities$, loadFailed$: new BehaviorSubject(false), refresh: () => of([]) } },
        { provide: BmsApiService, useValue: { get: () => of({ data: [] }), put: () => of({}) } },
        { provide: ModuleService, useValue: { enabledModules$: new BehaviorSubject(enabled), isModuleEnabled: (slug: string) => enabled.includes(slug) } },
        { provide: AuthApiService, useValue: { getAllOpenToWork: () => of({}) } },
        { provide: DatabaseService, useValue: {} },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppShellComponent);
    root = fixture.nativeElement;
  });

  afterEach(() => localStorage.removeItem('ui-sidebar-collapsed'));

  function go(url: string): void {
    fixture.ngZone!.run(() => router.navigateByUrl(url));
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function expectSingleChrome(): void {
    expect(root.querySelectorAll('aside').length).toBe(1);
    expect(root.querySelectorAll('app-sidebar').length).toBe(1);
    expect(root.querySelectorAll('header').length).toBe(1);
    expect(root.querySelectorAll('app-header').length).toBe(1);
    expect(root.querySelectorAll('main').length).toBe(1);
    expect(root.querySelectorAll('router-outlet').length).toBe(1);
    expect(root.querySelectorAll('mat-sidenav, mat-sidenav-container, .bms-sidebar, .bms-shell').length).toBe(0);
    expect(root.querySelectorAll('main .page-stub').length).toBe(1);
  }

  it('renders exactly one sidebar, one header and one content container on a BMS route', fakeAsync(() => {
    go('/bms/dashboard');
    expectSingleChrome();
    const main = root.querySelector('main')!;
    expect(main.classList.contains('bms-workspace')).toBe(true);
    expect(root.querySelector('aside [aria-current="page"]')!.getAttribute('href')).toContain('/bms/dashboard');
  }));

  it('renders exactly one sidebar, one header and one content container on a legacy route', fakeAsync(() => {
    go('/manager/projects');
    expectSingleChrome();
    const main = root.querySelector('main')!;
    expect(main.classList.contains('bms-workspace')).toBe(false);
    expect(main.getAttribute('dir')).toBe('ltr');
    expect(root.querySelector('aside [aria-current="page"]')!.getAttribute('href')).toContain('/manager/projects');
  }));

  it('keeps the same single chrome when moving between BMS, legacy and non-sidebar pages', fakeAsync(() => {
    go('/bms/units');
    const aside = root.querySelector('aside');
    go('/manager/projects');
    go('/notification');
    expectSingleChrome();
    expect(root.querySelector('aside')).toBe(aside);
    expect(root.querySelector('aside [aria-current="page"]')).toBeNull();
  }));

  it('lists BMS and legacy modules together and hides BMS links the user has no ability for', fakeAsync(() => {
    go('/bms/dashboard');
    const component = fixture.componentInstance;
    const sections = new Set(component.groups.map(group => group.section));
    expect(sections.has('bms')).toBe(true);
    expect(sections.size).toBeGreaterThan(1);
    const routes = component.groups.reduce((all, group) => all.concat(group.items.map(item => item.route)), [] as string[]);
    expect(routes).toContain('/bms/units');
    expect(routes).not.toContain('/bms/access');
    abilities$.next([]);
    fixture.detectChanges();
    const remaining = component.groups.reduce((all, group) => all.concat(group.items.map(item => item.route)), [] as string[]);
    expect(remaining.filter(route => route.startsWith('/bms/'))).toEqual([]);
    expect(remaining.length).toBeGreaterThan(0);
  }));

  it('switches the shell, not the document, to RTL and keeps legacy content LTR', fakeAsync(() => {
    go('/manager/projects');
    fixture.componentInstance.lang.language$.next('ar');
    fixture.detectChanges();
    expect(root.querySelector('.app-shell')!.getAttribute('dir')).toBe('rtl');
    expect(root.querySelector('main')!.getAttribute('dir')).toBe('ltr');
    go('/bms/dashboard');
    expect(root.querySelector('main')!.getAttribute('dir')).toBe('rtl');
    fixture.componentInstance.lang.language$.next('en');
  }));

  it('turns the sidebar into an inert off-canvas drawer on mobile and opens it from the header', fakeAsync(() => {
    go('/bms/dashboard');
    const component = fixture.componentInstance;
    component.mobile = true;
    fixture.detectChanges();
    const aside = root.querySelector('aside')!;
    expect(aside.hasAttribute('inert')).toBe(true);
    expect(aside.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('.app-backdrop')).toBeNull();
    (root.querySelector('.menu-toggle') as HTMLElement).click();
    fixture.detectChanges();
    tick();
    expect(aside.hasAttribute('inert')).toBe(false);
    expect(aside.classList.contains('is-open')).toBe(true);
    expect(root.querySelectorAll('.app-backdrop').length).toBe(1);
    expect(root.querySelectorAll('aside').length).toBe(1);
    component.onEscape();
    fixture.detectChanges();
    expect(aside.hasAttribute('inert')).toBe(true);
  }));

  it('defaults to the icon rail only on narrow desktops and lets an explicit choice win', () => {
    expect(AppShellComponent.resolveCollapsed(null, 1440)).toBe(false);
    expect(AppShellComponent.resolveCollapsed(null, 1280)).toBe(false);
    expect(AppShellComponent.resolveCollapsed(null, 1279)).toBe(true);
    expect(AppShellComponent.resolveCollapsed(null, 992)).toBe(true);
    expect(AppShellComponent.resolveCollapsed(null, 991)).toBe(false);
    expect(AppShellComponent.resolveCollapsed(false, 1100)).toBe(false);
    expect(AppShellComponent.resolveCollapsed(true, 1600)).toBe(true);
  });
});
