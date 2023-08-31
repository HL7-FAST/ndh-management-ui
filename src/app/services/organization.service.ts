import { Injectable } from '@angular/core';
import { ResourceService } from './core/resource.service';
import { Bundle, Organization, Resource } from 'fhir/r4';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends ResourceService { 
  resourceType = 'Organization';

  get(organizationId: string): Observable<Organization> {
    return super.getResource(this.resourceType, organizationId);
  }

  create(organization: Organization): Observable<Bundle<Organization>> {
    return super.createResource(this.resourceType, organization);
  }

  update(id: string, organization: Organization): Observable<Bundle<Organization>> {
    return super.updateResource(this.resourceType, id, organization);
  }

  delete(id: string): Observable<Bundle<Organization>> {
    return super.deleteResource(this.resourceType, id);
  }

  override async getAll(queryString: string): Promise<Organization[]> {
      return super.getAll(this.resourceType, queryString);
  }

  
  async addEndpoint(organizationId: string, endpointId: string) {
    console.log('addEndpoint', organizationId, endpointId);
    const organization = await firstValueFrom(this.get(organizationId));
    if (!organization) {
      throw new Error(`No Organization found with ID: ${organizationId}`);
    }

    if (!organization.endpoint) {
      organization.endpoint = [];
    }

    const reference = `Endpoint/${endpointId}`;
    if (organization.endpoint.some(e => e.reference === reference)) {
      return;
    }

    organization.endpoint.push({ reference: reference});
    await firstValueFrom(this.update(organizationId, organization));
  }

  async removeEndpoint(organizationId: string, endpointId: string) {
    const organization = await firstValueFrom(this.get(organizationId));
    if (!organization) {
      throw new Error(`No Organization found with ID: ${organizationId}`);
    }

    const index = (organization.endpoint || []).findIndex(e => e.reference === `Endpoint/${endpointId}`);
    if (index < 0) {
      return;
    }

    organization.endpoint?.splice(index, 1);
    await firstValueFrom(this.update(organizationId, organization));
  }
}
