import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, tap } from 'rxjs';
import { ErrorHandlingService } from './error-handling.service';
import { Bundle, CapabilityStatement, Meta, OperationOutcome, Parameters, Resource } from 'fhir/r4';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: "root",
})
export class ResourceService<T extends Resource> {
  protected baseApiUrl: string;

  protected availableResources: string[] = ["Endpoint", "Organization"];

  constructor(
    protected http: HttpClient,
    protected errorHandler: ErrorHandlingService,
    protected configService: ConfigService
  ) {
    this.baseApiUrl = this.configService.baseApiUrl;
  }

  get AvailableResources(): string[] {
    return this.availableResources;
  }

  set AvailableResources(resources: string[]) {
    //clear options
    this.availableResources.splice(0);

    //set new options
    this.availableResources = [...resources];
  }

  getResource(resourceType: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.baseApiUrl}/${resourceType}/${id}`).pipe(
      map((response: T) => {
        return response;
      }),
      catchError(this.errorHandler.handleError)
    );
  }

  createResource(resourceType: string, resource: T): Observable<T> {
    let request: Observable<T>;
    const url = `${this.baseApiUrl}/${resourceType}`;

    if (resource.id && resource.id.length > 0) {
      request = this.http.put<T>(`${url}/${resource.id}`, resource);
    }
    else {
      request = this.http.post<T>(url, resource);
    }

    return request.pipe(
        tap(() => console.log(`saving resource`)),
        map((response: T) => {
          return response;
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  updateResource(resourceType: string, id: string, resource: T): Observable<T> {
    return this.http
      .put<T>(`${this.baseApiUrl}/${resourceType}/${id}`, resource)
      .pipe(
        tap(() => console.log(`saving resource`)),
        map((response: T) => {
          return response;
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  deleteResource(resourceType: string, id: string): Observable<T> {
    const url = `${this.baseApiUrl}/${resourceType}/${id}`;

    return this.http
      .delete<T>(url)
      .pipe(
        tap(() => console.log(`submit resource for deletion`)),
        map((response: T) => {
          return response;
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  deleteAllResourcesById(resourceType: string, ids: string[]): Observable<OperationOutcome> {

    const transaction: Bundle = { resourceType: 'Bundle', type: 'transaction', entry: [] };

    (ids || []).forEach(id => transaction.entry?.push({ request: { method: 'DELETE', url: `${resourceType}/${id}` } }));

    return this.http.post<OperationOutcome>(this.baseApiUrl, transaction);
  }



  searchResource(resourceType: string, queryString: string): Observable<Bundle<T>> {
    let requestUrl = `${this.baseApiUrl}/${resourceType}`;
    queryString = encodeURI(queryString);

    if (queryString.startsWith(`${this.baseApiUrl}`)) {
      requestUrl = queryString;
    } else {
      if (!queryString.startsWith('?')) {
        queryString = `?${queryString}`;
      }
      requestUrl = requestUrl.concat(queryString);
    }

    return this.http.get<Bundle<T>>(`${requestUrl}`).pipe(
      map((response: Bundle<T>) => {
        return response;
      }),
      catchError(this.errorHandler.handleError)
    );
  }


  async getLink(url: string): Promise<Bundle<T>> {
    return firstValueFrom(this.http.get<Bundle<T>>(url));
  }

  async getAll(resourceType: string, queryString: string): Promise<T[]> {
    if (!queryString.startsWith('?')) {
      queryString = `?${queryString}`;
    }
    queryString = encodeURI(queryString);

    const requestUrl = `${this.baseApiUrl}/${resourceType}${queryString}`;

    const resources: T[] = [];
    const res = await this.getLink(requestUrl);
    resources.push(...(res.entry || []).map(r => r.resource).filter((r): r is T => r !== undefined));

    let next = res.link?.find(l => l.relation === 'next');

    while (next) {
      const nextResources = await this.getLink(next.url);
      resources.push(...(nextResources.entry || []).map(r => r.resource).filter((r): r is T => r !== undefined));
      next = nextResources.link?.find(l => l.relation === 'next');
    }

    return resources;
  }
  
  async getAllIds(resourceType: string, queryString: string): Promise<string[]> {    
    const res = await this.getAll(resourceType, queryString);
    return (res || []).map(r => r.id as string);
  }


  metaAdd(resourceType: string, resourceId: string, valueMeta: Meta): Observable<Parameters> {

    const url = `${this.baseApiUrl}/${resourceType}/${resourceId}/$meta-add`;

    const parameters: Parameters = {
      resourceType: 'Parameters',
      parameter: [{
        name: 'meta',
        valueMeta: valueMeta
      }]
    };

    return this.http.post<Parameters>(url, parameters);

  }

  metaDelete(resourceType: string, resourceId: string, valueMeta: Meta): Observable<Parameters> {

    const url = `${this.baseApiUrl}/${resourceType}/${resourceId}/$meta-delete`;

    const parameters: Parameters = {
      resourceType: 'Parameters',
      parameter: [{
        name: 'meta',
        valueMeta: valueMeta
      }]
    };

    return this.http.post<Parameters>(url, parameters);

  }


  getCapabilityStatement(resourceServer: string): Observable<CapabilityStatement> {
    return this.http
      .get<CapabilityStatement>(`${resourceServer}/metadata`)
      .pipe(
        map((response: CapabilityStatement) => {
          return response;
        }),
        catchError(this.errorHandler.handleError)
      );
  }
}