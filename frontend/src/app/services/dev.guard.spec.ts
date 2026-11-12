import { TestBed } from '@angular/core/testing';

import { DevGuard } from './dev.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DevGuard', () => {
  let guard: DevGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    guard = TestBed.inject(DevGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
