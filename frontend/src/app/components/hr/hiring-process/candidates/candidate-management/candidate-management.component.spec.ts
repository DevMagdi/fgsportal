import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateManagementComponent } from './candidate-management.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CandidateManagementComponent', () => {
  let component: CandidateManagementComponent;
  let fixture: ComponentFixture<CandidateManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CandidateManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
