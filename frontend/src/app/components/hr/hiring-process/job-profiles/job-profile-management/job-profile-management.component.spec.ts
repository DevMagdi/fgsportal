import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProfileManagementComponent } from './job-profile-management.component';

describe('JobProfileManagementComponent', () => {
  let component: JobProfileManagementComponent;
  let fixture: ComponentFixture<JobProfileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
