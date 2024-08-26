import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainResource, Meta, OperationOutcome, Parameters } from 'fhir/r4';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { AttestationUtils } from '../utils/attestation-utils';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {

  protected baseApiUrl: string;

  constructor(
    protected http: HttpClient,
    protected configService: ConfigService
  ) {
    this.baseApiUrl = this.configService.baseApiUrl;
  }

  attestResource(resource: DomainResource): Observable<OperationOutcome> {

    const parameters: Parameters = {
      resourceType: 'Parameters',
      parameter: [
        {
          name: 'resource',
          valueReference: {
            reference: resource.resourceType + '/' + resource.id
          }
        }
      ]
    };

    return this.http.post<OperationOutcome>(`${this.baseApiUrl}/$attest`, parameters);
  }


  unAttestResource(resource: DomainResource): Observable<DomainResource> {

    const url = `${this.baseApiUrl}/${resource.resourceType}/${resource.id}/$meta-add`;
    const valueMeta: Meta = { security: [AttestationUtils.getNotAttestedSecurityCoding()] };

    const parameters: Parameters = {
      resourceType: 'Parameters',
      parameter: [{
        name: 'meta',
        valueMeta: valueMeta
      }]
    };

    return this.http.post<Parameters>(url, parameters);

  }
}
