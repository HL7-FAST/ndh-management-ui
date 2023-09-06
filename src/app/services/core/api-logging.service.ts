import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IApiLog } from 'src/app/interfaces/api-log.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiLoggingService {

  private _apiLogAddedSubject = new BehaviorSubject<IApiLog|undefined>(undefined);

  constructor() { }


  public get apiLogAddedSubject(): Observable<IApiLog|undefined> {
    return this._apiLogAddedSubject.asObservable();
  }

  public addLog(apiLog: IApiLog) {
    this._apiLogAddedSubject.next(apiLog);
  }

}
