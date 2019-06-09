import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { TokenService } from '../token-service/token.service';
import { ToastService } from '../toast-service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorProvider implements HttpInterceptor {

  constructor(private token: TokenService,
    public toastService: ToastService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenObservable = this.token.getToken().pipe(
      map((token) => {
        // if we have a token add it to the request
        if (token) {
          return request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
        }
        return request;
      }),
    );

    return tokenObservable.pipe(
      flatMap((req) => {
        return next.handle(req).pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                /* Show general error toast for all errors except usersession */
                if (!req.url.includes('user/session')) {
                  this.toastService.presentStandardError(err.error, 'Session timed out. Please login again.');
                }
                this.token.deleteToken().subscribe();
                return throwError(err);
              }
            }
            return throwError(err);
          }),
          tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              if (event.status === 200) {
                const newToken = event.headers.get(this.token.key);
                //console.log(event.body)
                if (newToken && newToken.length > 0) {
                  return this.token.setToken(newToken);
                }
              }
            }
            return of(null);
          }),
          tap((event: HttpEvent<any>) => {
            return event;
          }),
        );
      }),
    );
  }

}
