import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationReportComponent } from './vacation-report.component';

describe('VacationReportComponent', () => {
  let component: VacationReportComponent;
  let fixture: ComponentFixture<VacationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
