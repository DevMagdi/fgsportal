import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthApiService } from './services/auth-api.service';
import { DatabaseService } from './services/database.service';
import { MessagingService } from './services/messaging.service';
import { ModuleService } from './services/module.service';

@Component({ selector: 'alphaiota-loading', template: '<span class="loading-stub">Loading</span>' })
class LoadingStubComponent {}

// Like the real shell, the stub owns the primary outlet of every signed-in page.
@Component({ selector: 'app-shell', template: '<div class="shell-stub"><router-outlet></router-outlet></div>' })
class ShellStubComponent {}

@Component({ template: '<p class="signin-page">sign in</p>' })
class SigninPageStubComponent {}

@Component({ template: '<p class="landing-page">landing</p>' })
class LandingPageStubComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.removeItem('userData');
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'signin', component: SigninPageStubComponent },
        { path: 'landing', component: LandingPageStubComponent },
      ])],
      declarations: [AppComponent, LoadingStubComponent, ShellStubComponent, SigninPageStubComponent, LandingPageStubComponent],
      providers: [
        {
          provide: MessagingService,
          useValue: {
            currentMessage: new BehaviorSubject(null),
            requestPermission: jasmine.createSpy('requestPermission'),
            receiveMessage: jasmine.createSpy('receiveMessage'),
          },
        },
        {
          provide: AuthApiService,
          useValue: {
            user: new BehaviorSubject(null),
            autoLogin: jasmine.createSpy('autoLogin'),
          },
        },
        { provide: DatabaseService, useValue: {} },
        { provide: ModuleService, useValue: { loadEnabledModules: jasmine.createSpy('loadEnabledModules') } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`should have as title 'alphaiota'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toEqual('alphaiota');
  });

  it('renders the signed-out outlet and loading slot while no user is signed in', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.main')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('alphaiota-loading')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });

  // Found in the browser against the real backend: with two independent *ngIf blocks the signed-out outlet
  // was destroyed after the shell's outlet was created, which unregistered the new outlet. The URL changed
  // after sign-in but the sign-in form stayed on screen inside the shell until a reload.
  it('renders the landing page inside the shell after sign-in, and the sign-in page after sign-out', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    const view: HTMLElement = fixture.nativeElement;
    const settle = () => { tick(); fixture.detectChanges(); tick(); fixture.detectChanges(); };

    fixture.componentInstance.loggedIn = false;
    fixture.detectChanges();
    router.navigateByUrl('/signin');
    settle();
    expect(view.querySelector('.main .signin-page')).toBeTruthy();

    // Sign-in: the state flips and the app navigates to the landing page.
    fixture.componentInstance.loggedIn = true;
    fixture.detectChanges();
    router.navigateByUrl('/landing');
    settle();
    expect(view.querySelector('.shell-stub .landing-page')).toBeTruthy();
    expect(view.querySelector('.signin-page')).toBeNull();
    expect(view.querySelectorAll('router-outlet').length).toBe(1);

    // Sign-out: back to the bare outlet.
    fixture.componentInstance.loggedIn = false;
    fixture.detectChanges();
    router.navigateByUrl('/signin');
    settle();
    expect(view.querySelector('.main .signin-page')).toBeTruthy();
    expect(view.querySelector('.shell-stub')).toBeNull();
  }));
});
