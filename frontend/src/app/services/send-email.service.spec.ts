import { TestBed } from '@angular/core/testing';

import { SendEmailService } from './send-email.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SendEmailService', () => {
  let service: SendEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SendEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
