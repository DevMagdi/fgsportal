import { TestBed } from '@angular/core/testing';

import { CRMGuard } from './crm.guard';

describe('CRMGuard', () => {
  let guard: CRMGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CRMGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
