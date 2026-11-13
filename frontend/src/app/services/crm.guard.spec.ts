import { TestBed } from '@angular/core/testing';

import { CRMGuard } from './crm.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CRMGuard', () => {
  let guard: CRMGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    guard = TestBed.inject(CRMGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
