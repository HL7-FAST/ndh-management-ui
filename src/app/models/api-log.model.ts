import { HttpRequest } from "@angular/common/http";
import { IApiLog } from "../interfaces/api-log.interface";

export class ApiLog implements IApiLog {
  date: Date;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;


  constructor(date: Date, url: string, headers: Record<string, string>, method: string, body?: unknown) {  
    this.date = date;
    this.url = url;
    this.method = method;
    this.headers = headers;
    this.body = body;
  }
  
}
