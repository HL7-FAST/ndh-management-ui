import { Injectable } from '@angular/core';
import { ResourceService } from './core/resource.service';
import { PractitionerRole } from 'fhir/r4';

@Injectable({
  providedIn: 'root'
})
export class PractitionerRoleService extends ResourceService<PractitionerRole> { }
