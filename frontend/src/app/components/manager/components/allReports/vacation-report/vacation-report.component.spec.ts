import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationReportComponent } from './vacation-report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VacationReportComponent', () => {
  let component: VacationReportComponent;
  let fixture: ComponentFixture<VacationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
