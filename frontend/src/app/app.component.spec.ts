import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthApiService } from './services/auth-api.service';
import { DatabaseService } from './services/database.service';
import { MessagingService } from './services/messaging.service';
import { ModuleService } from './services/module.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.removeItem('userData');
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
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
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'alphaiota'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('alphaiota');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('alphaiota app is running!');
  });
});
