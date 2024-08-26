import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "../services/config.service";
import { UserProfileService } from "../services/core/user-profile.service";


@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {

  constructor(private configService: ConfigService, private profileService: UserProfileService) {}
  
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (req.url.startsWith(this.configService.baseApiUrl)) {
      console.log('ApiAuthInterceptor - API call', req.url, JSON.stringify(this.profileService.getProfile()));

      const currentProfile = this.profileService.getProfile();
      if (currentProfile) {
        const headers = req.headers.set('X-User', JSON.stringify(currentProfile));
        req = req.clone({
          headers
        });
      }
    }

    return next.handle(req);
  }
}