import { Injectable } from '@angular/core';
import { ResourceService } from './core/resource.service';
import { Bundle, Endpoint, Meta } from 'fhir/r4';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndpointService extends ResourceService {
  resourceType: string = 'Endpoint';


  create(endpoint: Endpoint): Observable<Bundle<Endpoint>> {
    return super.createResource(this.resourceType, endpoint);
  }

  update(id: string, endpoint: Endpoint): Observable<Bundle<Endpoint>> {
    return super.updateResource(this.resourceType, id, endpoint);
  }

  delete(id: string): Observable<Bundle<Endpoint>> {
    return super.deleteResource(this.resourceType, id);
  }

  search(queryString: string): Observable<Bundle<Endpoint>> {
      return super.searchResource(this.resourceType, queryString);
  }
  
}
