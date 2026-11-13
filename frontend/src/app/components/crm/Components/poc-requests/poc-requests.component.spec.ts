import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PocRequestsComponent } from './poc-requests.component';

describe('PocRequestsComponent', () => {
  let component: PocRequestsComponent;
  let fixture: ComponentFixture<PocRequestsComponent>;

  beforeEach(async () => {
    const user = { accRole: 'test-observer', department: 'test-observer', accPosition: '' };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PocRequestsComponent],
      providers: [
        { provide: AuthApiService, useValue: { user: of(user) } },
        { provide: DatabaseService, useValue: {} },
        { provide: NotificationService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates for a signed-in user without privileged request scopes', () => {
    expect(component).toBeTruthy();
    expect(component.myRequests).toEqual([]);
    expect(component.myRFPRequests).toEqual([]);
  });
});
