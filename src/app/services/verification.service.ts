import { Injectable } from '@angular/core';
import { Bundle, Parameters, VerificationResult } from 'fhir/r4';
import { ResourceService } from './core/resource.service';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService extends ResourceService<VerificationResult>  {
  resourceType = 'VerificationResult';

  get(verificationResultId: string): Observable<VerificationResult> {
    return super.getResource(this.resourceType, verificationResultId);
  }

  create(verificationResult: VerificationResult): Observable<VerificationResult> {
    return super.createResource(this.resourceType, verificationResult);
  }

  update(id: string, verificationResult: VerificationResult): Observable<VerificationResult> {
    return super.updateResource(this.resourceType, id, verificationResult);
  }

  delete(id: string): Observable<VerificationResult> {
    return super.deleteResource(this.resourceType, id);
  }

  override async getAll(queryString: string): Promise<VerificationResult[]> {
      return super.getAll(this.resourceType, queryString);
  }


  // getForTarget(targetResourceType: string, targetId: string): Observable<VerificationResult[]> {
  //   return this.http.get<Bundle<VerificationResult>>(`${this.baseApiUrl}/VerificationResult?target=${targetResourceType}/${targetId}`).pipe(
  //     map((res: Bundle<VerificationResult>) => {
  //       return (res.entry || []).map(e => e.resource).filter((r): r is VerificationResult => r !== undefined);
  //     }),
  //     catchError(this.errorHandler.handleError)
  //   );
  // }
  getForTarget(targetResourceType: string, targetId: string, sort = '-status-date'): Observable<Bundle<VerificationResult>> {
    return this.http.get<Bundle<VerificationResult>>(`${this.baseApiUrl}/VerificationResult?target=${targetResourceType}/${targetId}&_sort=${sort}`);
  }


  getParameters(target: string, attestor?: string) {

    const parameters: Parameters = {
      resourceType: 'Parameters',
      parameter: [
        {
          name: 'verification',
          part: [
            {
              name: 'target',
              valueReference: {
                reference: target
              }
            }
          ]
        }
      ]
    };

    if (attestor) {
      (parameters.parameter || [])[0].part?.push({
        name: 'attestor',
        valueReference: {
          reference: attestor
        }
      });
    }

    return parameters;
  }

  verify(parameters: Parameters): Observable<VerificationResult> {
    return this.http.post<VerificationResult>(`${this.baseApiUrl}/$verify`, parameters);
  }
  
}
