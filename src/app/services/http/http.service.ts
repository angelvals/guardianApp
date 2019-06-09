import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PresentationUrlEndpointInfo } from '../../../common/Http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/index';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  put<T>(endpoint: string, body: T, reqOpts?): any {
    const full = `${PresentationUrlEndpointInfo.serviceUrl}/${endpoint}`;
    return this.http.put(full, body, reqOpts);
  }

  post<T>(endpoint: string, body?: T, reqOpts?): any {
    const full = `${PresentationUrlEndpointInfo.serviceUrl}/${endpoint}`;
    return this.http.post(full, body, reqOpts);
  }

  get(endpoint: string): any {
    const full = `${PresentationUrlEndpointInfo.serviceUrl}/${endpoint}`;
    return this.http.get(full).pipe(catchError(error => of(`I caught error (get) ${error}`)));
  }
}
