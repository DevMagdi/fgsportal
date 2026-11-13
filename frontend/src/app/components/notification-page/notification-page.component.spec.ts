import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationPageComponent } from './notification-page.component';

describe('NotificationPageComponent', () => {
  let component: NotificationPageComponent;
  let fixture: ComponentFixture<NotificationPageComponent>;
  let navigateByUrl: jasmine.Spy;

  beforeEach(async () => {
    navigateByUrl = jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve(true));
    await TestBed.configureTestingModule({
      declarations: [NotificationPageComponent],
      providers: [
        {
          provide: MessagingService,
          useValue: {
            currentMessage: new BehaviorSubject(null),
            getNotificationByUser: jasmine.createSpy('getNotificationByUser').and.returnValue(of([])),
            deleteNotification: jasmine.createSpy('deleteNotification'),
            updateNotification: jasmine.createSpy('updateNotification').and.returnValue(Promise.resolve()),
          },
        },
        { provide: AuthApiService, useValue: { user: new BehaviorSubject(null) } },
        { provide: Router, useValue: { navigateByUrl } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('redirects unauthenticated users to sign-in during initialization', () => {
    expect(component).toBeTruthy();
    expect(navigateByUrl).toHaveBeenCalledOnceWith('/signin');
  });
});
