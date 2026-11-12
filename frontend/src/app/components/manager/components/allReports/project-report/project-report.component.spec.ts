import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReportComponent } from './project-report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProjectReportComponent', () => {
  let component: ProjectReportComponent;
  let fixture: ComponentFixture<ProjectReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ProjectReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
