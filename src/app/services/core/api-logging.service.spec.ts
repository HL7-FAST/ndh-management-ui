import { TestBed } from '@angular/core/testing';

import { ApiLoggingService } from './api-logging.service';

describe('ApiLoggingService', () => {
  let service: ApiLoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiLoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
