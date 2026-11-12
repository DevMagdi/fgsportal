import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationPageComponent } from './notification-page.component';

describe('NotificationPageComponent', () => {
  let component: NotificationPageComponent;
  let fixture: ComponentFixture<NotificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
