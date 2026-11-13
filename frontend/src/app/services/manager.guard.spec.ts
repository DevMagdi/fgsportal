import { TestBed } from '@angular/core/testing';

import { ManagerGuard } from './manager.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ManagerGuard', () => {
  let guard: ManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    guard = TestBed.inject(ManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
