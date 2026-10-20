import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveApprovedComponent } from './incentive-approved.component';

describe('IncentiveApprovedComponent', () => {
  let component: IncentiveApprovedComponent;
  let fixture: ComponentFixture<IncentiveApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
