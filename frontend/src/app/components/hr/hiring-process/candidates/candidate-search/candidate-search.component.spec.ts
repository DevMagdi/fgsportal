import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSearchComponent } from './candidate-search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CandidateSearchComponent', () => {
  let component: CandidateSearchComponent;
  let fixture: ComponentFixture<CandidateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CandidateSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
