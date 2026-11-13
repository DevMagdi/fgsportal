import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDetailsComponent } from './candidate-details.component';

describe('CandidateDetailsComponent', () => {
  let component: CandidateDetailsComponent;
  let fixture: ComponentFixture<CandidateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDetailsComponent);
    component = fixture.componentInstance;
    component.candidate = {
      id: 'candidate-1',
      Job_title: [],
      first_name: 'Taylor',
      last_name: 'Candidate',
      email: 'taylor@example.test',
      phone_number: '5550100',
      file_name: 'resume.pdf',
      file_path: '/files/resume.pdf',
      note: '',
      address: '',
      experience: '',
      graduated_year: '',
      uploaded_by_id: 1,
      uploaded_by_name: 'Recruiter',
      uploaded_photoURL: '',
      comment: '',
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    fixture.detectChanges();
  });

  it('renders the supplied candidate name', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Taylor Candidate');
  });
});
