import { TestBed } from '@angular/core/testing';

import { ProjectCostApiService } from './project-cost-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProjectCostApiService', () => {
  let service: ProjectCostApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ProjectCostApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
