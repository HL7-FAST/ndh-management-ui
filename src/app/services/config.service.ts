import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './core/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  constructor(private localStorageService: LocalStorageService) {
  }


  public get baseApiUrl(): string {
    const sessionUrl = this.localStorageService.getItem('config-baseApiUrl');
    if (sessionUrl && sessionUrl.length > 0) {
      return sessionUrl;
    }
    return environment.baseApiUrl.replace(/\/$/,'');
  }
  public set baseApiUrl(newUrl: string) {
    this.localStorageService.setItem('config-baseApiUrl', newUrl.replace(/\/$/,''));
  }


  public get includeUnattested(): boolean {
    const sessionUnattested = this.localStorageService.getItem('config-includeUnattested');
    if (sessionUnattested && sessionUnattested.length > 0) {
      return sessionUnattested.toLowerCase() === 'true';
    }
    return false;
  }
  public set includeUnattested(newVal: boolean) {
    this.localStorageService.setItem('config-includeUnattested', newVal.toString());
  }


}
