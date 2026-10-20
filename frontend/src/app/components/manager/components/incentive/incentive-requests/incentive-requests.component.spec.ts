import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveRequestsComponent } from './incentive-requests.component';

describe('IncentiveRequestsComponent', () => {
  let component: IncentiveRequestsComponent;
  let fixture: ComponentFixture<IncentiveRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
