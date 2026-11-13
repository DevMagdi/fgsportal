import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerReportComponent } from './project-manager-report.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ProjectManagerReportComponent', () => {
  let component: ProjectManagerReportComponent;
  let fixture: ComponentFixture<ProjectManagerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [ ProjectManagerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
