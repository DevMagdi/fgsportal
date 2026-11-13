import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSkillManangementComponent } from './job-skill-manangement.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JobSkillManangementComponent', () => {
  let component: JobSkillManangementComponent;
  let fixture: ComponentFixture<JobSkillManangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ JobSkillManangementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSkillManangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
