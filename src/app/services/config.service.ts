import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './core/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  constructor(private localStorageService: LocalStorageService) {
  }

  private trimUrl(newUrl: string): string {
    return newUrl.replace(/\/$/,'');
  }

  public get availableBaseApiUrls(): Array<string> {
    let currentStorageValue = this.localStorageService.getItem('config-availableBaseApiUrls');
    if (!currentStorageValue) {
      currentStorageValue = '[]';
    }
    let availableBaseApiUrls = JSON.parse(currentStorageValue);
    if (!availableBaseApiUrls || typeof(availableBaseApiUrls) != typeof([]) || availableBaseApiUrls.length < 1) {
      availableBaseApiUrls = environment.baseApiUrls;
      this.localStorageService.setItem('config-availableBaseApiUrls', JSON.stringify(availableBaseApiUrls));
    }
    return availableBaseApiUrls;
  }
  public set availableBaseApiUrls(newUrls: Array<string>) {
    newUrls = newUrls.map(u => this.trimUrl(u));
    this.localStorageService.setItem('config-availableBaseApiUrls', JSON.stringify(newUrls));
  }
  public addAvailableBaseApiUrls(newUrl: string): Array<string> {
    newUrl = this.trimUrl(newUrl);
    const urls = this.availableBaseApiUrls;
    console.log('urls:', urls, urls.indexOf(newUrl));
    if (urls.indexOf(newUrl) < 0) {
      urls.push(newUrl);
      console.log(urls);
      this.localStorageService.setItem('config-availableBaseApiUrls', JSON.stringify(urls));
    }
    return this.availableBaseApiUrls;
  }
  public removeAvailableBaseApiUrls(oldUrl: string): Array<string> {
    oldUrl = this.trimUrl(oldUrl);
    const newUrls = this.availableBaseApiUrls.filter(u => u !== oldUrl);
    this.availableBaseApiUrls = newUrls;
    return newUrls;
  }


  public get baseApiUrl(): string {
    const sessionUrl = this.localStorageService.getItem('config-baseApiUrl');
    if (sessionUrl && sessionUrl.length > 0) {
      return sessionUrl;
    }
    return this.availableBaseApiUrls[0];
  }
  public set baseApiUrl(newUrl: string) {
    newUrl = this.trimUrl(newUrl);
    this.addAvailableBaseApiUrls(newUrl);
    this.localStorageService.setItem('config-baseApiUrl', newUrl);
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
