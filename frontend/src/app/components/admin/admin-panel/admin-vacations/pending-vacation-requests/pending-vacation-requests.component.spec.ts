import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingVacationRequestsComponent } from './pending-vacation-requests.component';

describe('PendingVacationRequestsComponent', () => {
  let component: PendingVacationRequestsComponent;
  let fixture: ComponentFixture<PendingVacationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingVacationRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingVacationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
