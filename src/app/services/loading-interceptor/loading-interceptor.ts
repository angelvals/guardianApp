import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, } from '@angular/common/http';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {
  count = 0;
  spinner = new Subject();
  loading: Promise<any>;

  constructor(private loadingController: LoadingController) {
    this.$spinner.subscribe();
  }

  // debounce the count so that the spinner doesn't disappear and reappear
  // when multiple sequential requests are made
  $spinner = this.spinner.asObservable().pipe(
    tap(() => {
      if (!this.loading) {
        // Remove the spinner after 15 seconds, if we did not manually (default and maximum)
        this.loading = this.loadingController.create({ duration: 15000 }).then((load => {
          load.present();
        }));
      }
    }),
    debounceTime(150),
    tap((count) => {
      if (this.loading && count === 0) {
        this.loadingController.dismiss().catch(err => console.log(`Error dismissing spinner: ${err}`));
        this.loading = undefined;
      }
    }),
  );

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.count += 1;
    this.spinner.next(this.count);

    return next.handle(req).pipe(
      catchError((err: any) => {
        this.count = 0;
        this.spinner.next(this.count);
        return throwError(err);
      }),
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.count -= 1;
          this.spinner.next(this.count);
        }
      }),
    );
  }
}
