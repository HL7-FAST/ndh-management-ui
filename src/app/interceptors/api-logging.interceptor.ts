import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { ApiLoggingService } from '../services/core/api-logging.service';

@Injectable()
export class ApiLoggingInterceptor implements HttpInterceptor {

  constructor(private configService: ConfigService, private apiLoggingService: ApiLoggingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.startsWith(this.configService.baseApiUrl)) {
      const headers: Record<string, string> = {};
      (request.headers.keys() || []).forEach(k => headers[k] = request.headers.get(k) ?? '');
      this.apiLoggingService.addLog({ date: new Date(), url: request.url, headers: headers, method: request.method, body: request.body });
    }

    return next.handle(request);
  }
}
