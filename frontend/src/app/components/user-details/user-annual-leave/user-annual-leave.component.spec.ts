import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAnnualLeaveComponent } from './user-annual-leave.component';

describe('UserAnnualLeaveComponent', () => {
  let component: UserAnnualLeaveComponent;
  let fixture: ComponentFixture<UserAnnualLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAnnualLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAnnualLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
