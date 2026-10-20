import { TestBed } from '@angular/core/testing';

import { ShareRatingDataServiceService } from './share-rating-data-service.service';

describe('ShareRatingDataServiceService', () => {
  let service: ShareRatingDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareRatingDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
