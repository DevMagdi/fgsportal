import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpWeeklyReportsComponent } from './emp-weekly-reports.component';

describe('EmpWeeklyReportsComponent', () => {
  let component: EmpWeeklyReportsComponent;
  let fixture: ComponentFixture<EmpWeeklyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpWeeklyReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpWeeklyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
