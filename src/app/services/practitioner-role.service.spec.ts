import { TestBed } from '@angular/core/testing';

import { PractitionerRoleService } from './practitioner-role.service';

describe('PractitionerRoleService', () => {
  let service: PractitionerRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PractitionerRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
