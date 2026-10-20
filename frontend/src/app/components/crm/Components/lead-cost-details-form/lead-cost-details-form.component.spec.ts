import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCostDetailsFormComponent } from './lead-cost-details-form.component';

describe('LeadCostDetailsFormComponent', () => {
  let component: LeadCostDetailsFormComponent;
  let fixture: ComponentFixture<LeadCostDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadCostDetailsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadCostDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
