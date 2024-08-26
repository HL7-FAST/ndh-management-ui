import { TestBed } from '@angular/core/testing';

import { AttestationService } from './attestation.service';

describe('AttestationService', () => {
  let service: AttestationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttestationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
