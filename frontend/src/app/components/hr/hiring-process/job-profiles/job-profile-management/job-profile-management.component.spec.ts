import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProfileManagementComponent } from './job-profile-management.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JobProfileManagementComponent', () => {
  let component: JobProfileManagementComponent;
  let fixture: ComponentFixture<JobProfileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ JobProfileManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
