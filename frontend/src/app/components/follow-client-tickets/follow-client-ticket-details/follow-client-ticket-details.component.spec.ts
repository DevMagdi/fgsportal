import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ResStatus } from 'src/app/interfaces/res-status';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SendEmailService } from 'src/app/services/send-email.service';
import { FollowClientTicketDetailsComponent } from './follow-client-ticket-details.component';

describe('FollowClientTicketDetailsComponent', () => {
  let component: FollowClientTicketDetailsComponent;
  let fixture: ComponentFixture<FollowClientTicketDetailsComponent>;
  let getTicketByID: jasmine.Spy;

  beforeEach(async () => {
    getTicketByID = jasmine.createSpy('getTicketByID').and.returnValue(
      of({ status: ResStatus.Success_But_Empty, data: null })
    );
    const user = { key: 'test-user', accRole: 'test-observer', department: 'test-observer' };
    await TestBed.configureTestingModule({
      imports: [AngularMaterialModule, NoopAnimationsModule, RouterTestingModule],
      declarations: [FollowClientTicketDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 'ticket-1' }) } },
        {
          provide: AuthApiService,
          useValue: {
            user: of(user),
            getUserPermissionsByKey: jasmine.createSpy('getUserPermissionsByKey').and.returnValue(
              of({ status: ResStatus.Success_But_Empty, data: [] })
            ),
          },
        },
        { provide: DatabaseService, useValue: { getTicketByID } },
        { provide: NotificationService, useValue: {} },
        { provide: MessagingService, useValue: {} },
        { provide: SendEmailService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowClientTicketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates and requests the route-selected ticket', () => {
    expect(component).toBeTruthy();
    expect(getTicketByID).toHaveBeenCalledOnceWith('ticket-1');
    expect(component.currentClientTicket).toBeUndefined();
  });
});
