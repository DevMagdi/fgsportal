import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorReportApprovalComponent } from './senior-report-approval.component';

describe('SeniorReportApprovalComponent', () => {
  let component: SeniorReportApprovalComponent;
  let fixture: ComponentFixture<SeniorReportApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeniorReportApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeniorReportApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
