import { TestBed } from '@angular/core/testing';

import { FinanceService } from './finance.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FinanceService', () => {
  let service: FinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(FinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
