import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, filter, firstValueFrom, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import { Bundle, CapabilityStatement, Meta, OperationOutcome, Parameters, Resource } from 'fhir/r4';

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  protected baseApiUrl = `${environment.baseApiUrl}`;

  protected availableResources: string[] = ["Endpoint", "Organization"];

  constructor(
    protected http: HttpClient,
    protected errorHandler: ErrorHandlingService
  ) {}

  get AvailableResources(): string[] {
    return this.availableResources;
  }

  set AvailableResources(resources: string[]) {
    //clear options
    this.availableResources.splice(0);

    //set new options
    this.availableResources = [...resources];
  }

  getResource(resourceType: string, id: string): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/${resourceType}/${id}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  createResource(resourceType: string, resource: Resource): Observable<any> {
    let request: Observable<any>;
    let url = `${this.baseApiUrl}/${resourceType}`;

    if (resource.id && resource.id.length > 0) {
      request = this.http.put(`${url}/${resource.id}`, resource);
    }
    else {
      request = this.http.post(url, resource);
    }

    return request.pipe(
        tap((_) => console.log(`saving resource`)),
        map((response: any) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  updateResource(resourceType: string, id: string, resource: Resource): Observable<any> {
    return this.http
      .put<any>(`${this.baseApiUrl}/${resourceType}/${id}`, resource)
      .pipe(
        tap((_) => console.log(`saving resource`)),
        map((response: any) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  deleteResource(resourceType: string, id: string): Observable<any> {
    let url = `${this.baseApiUrl}/${resourceType}/${id}`;

    return this.http
      .delete<any>(url)
      .pipe(
        tap((_) => console.log(`submit resource for deletion`)),
        map((response: any) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  deleteAllResourcesById(resourceType: string, ids: string[]): Observable<OperationOutcome> {

    let transaction: Bundle = { resourceType: 'Bundle', type: 'transaction', entry: [] };

    (ids || []).forEach(id => transaction.entry?.push({ request: { method: 'DELETE', url: `${resourceType}/${id}` } }));

    return this.http.post<OperationOutcome>(this.baseApiUrl, transaction);
  }



  searchResource(resourceType: string, queryString: string): Observable<Bundle<any>> {
    let requestUrl = `${this.baseApiUrl}/${resourceType}`;

    if (queryString.startsWith(`${this.baseApiUrl}`)) {
      requestUrl = queryString;
    } else {
      if (!queryString.startsWith('?')) {
        queryString = `?${queryString}`;
      }
      requestUrl = requestUrl.concat(queryString);
    }

    return this.http.get<Bundle<any>>(`${requestUrl}`).pipe(
      map((response: Bundle<any>) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }


  protected async getNext(url: string): Promise<Resource[]> {
    const resources: Resource[] = [];
    let res = await firstValueFrom(this.http.get<Bundle<any>>(url));
    resources.push(...(res.entry || []).map(r => r.resource));

    if (res.link) {
      const next = res.link.find(l => l.relation === 'next');
      if (next) {
        console.log('next:', next);
        resources.push(... await this.getNext(next.url));
      }
    }

    return resources;
  }

  async getAll(resourceType: string, queryString: string): Promise<any[]> {
    if (!queryString.startsWith('?')) {
      queryString = `?${queryString}`;
    }
    const requestUrl = `${this.baseApiUrl}/${resourceType}${queryString}`;
    return await this.getNext(requestUrl);
  }
  
  async getAllIds(resourceType: string, queryString: string): Promise<string[]> {

    if (!queryString.startsWith('?')) {
      queryString = `?${queryString}`;
    }
    const requestUrl = `${this.baseApiUrl}/${resourceType}${queryString}`;
    const res = await this.getNext(requestUrl);
    return (res || []).map(r => r.id as string);
  }


  metaAdd(resourceType: string, resourceId: string, valueMeta: Meta): Observable<any> {

    let url = `${this.baseApiUrl}/${resourceType}/${resourceId}/$meta-delete`;

    const parameters: Parameters = {
      resourceType: 'Parameters',
      parameter: [{
        name: 'meta',
        valueMeta: valueMeta
      }]
    };

    return this.http.post(url, parameters);

  }

  metaDelete(resourceType: string, resourceId: string, valueMeta: Meta): Observable<any> {

    let url = `${this.baseApiUrl}/${resourceType}/${resourceId}/$meta-delete`;

    const parameters: Parameters = {
      resourceType: 'Parameters',
      parameter: [{
        name: 'meta',
        valueMeta: valueMeta
      }]
    };

    return this.http.post(url, parameters);

  }


  getCapabilityStatement(resourceServer: string): Observable<CapabilityStatement> {
    return this.http
      .get<CapabilityStatement>(`${resourceServer}/metadata`)
      .pipe(
        tap((_) => console.log(`submit request for capability statement`)),
        map((response: any) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  protected handleError(err: HttpErrorResponse) {
    return this.errorHandler.handleError(err);
  }
}