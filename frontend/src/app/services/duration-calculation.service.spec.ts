import { TestBed } from '@angular/core/testing';

import { DurationCalculationService } from './duration-calculation.service';

describe('DurationCalculationService', () => {
  let service: DurationCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DurationCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
