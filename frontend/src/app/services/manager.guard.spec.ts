import { TestBed } from '@angular/core/testing';

import { ManagerGuard } from './manager.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManagerGuard', () => {
  let guard: ManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    guard = TestBed.inject(ManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
