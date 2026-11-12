import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthApiService } from './services/auth-api.service';
import { DatabaseService } from './services/database.service';
import { MessagingService } from './services/messaging.service';
import { ModuleService } from './services/module.service';

@Component({ selector: 'alphaiota-loading', template: '<span class="loading-stub">Loading</span>' })
class LoadingStubComponent {}

@Component({ selector: 'app-navbar', template: '<nav class="navbar-stub"></nav>' })
class NavbarStubComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.removeItem('userData');
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, LoadingStubComponent, NavbarStubComponent],
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

  it('renders the authenticated shell and loading slot', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.main')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('alphaiota-loading')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
