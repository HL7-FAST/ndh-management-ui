import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../services/core/session.service';
import { ConfigService } from '../services/config.service';

@Injectable()
export class AttestationHeaderInterceptor implements HttpInterceptor {

  constructor(private configService: ConfigService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.startsWith(this.configService.baseApiUrl) && this.configService.includeUnattested)
    {
      let headers = request.headers.append('X-Purpose', 'attestation');
      return next.handle(request.clone({headers}));
    }
    
    return next.handle(request);
  }
}
