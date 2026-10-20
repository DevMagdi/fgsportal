import { TestBed } from '@angular/core/testing';

import { ProjectCostApiService } from './project-cost-api.service';

describe('ProjectCostApiService', () => {
  let service: ProjectCostApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCostApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
