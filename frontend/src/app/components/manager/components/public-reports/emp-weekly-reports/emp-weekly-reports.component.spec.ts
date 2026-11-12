import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpWeeklyReportsComponent } from './emp-weekly-reports.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('EmpWeeklyReportsComponent', () => {
  let component: EmpWeeklyReportsComponent;
  let fixture: ComponentFixture<EmpWeeklyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
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
