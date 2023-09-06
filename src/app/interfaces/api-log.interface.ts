import { HttpRequest } from "@angular/common/http";

export interface IApiLog {
  date: Date;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}