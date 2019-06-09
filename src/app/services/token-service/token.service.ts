import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { flatMap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs/index';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { Router } from '@angular/router';
import { StorageSubjects } from '../../storage/storage-subjects';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  notifier = new Subject<boolean>();
  authenticationState = this.subjects.authenticationState;
  initialized = false;

  readonly key: string = this.subjects.tokenKey;

  constructor(
    private storage: Storage, 
    private router: Router,
    private subjects: StorageSubjects,
  ) {
  }

  getToken() {
    return fromPromise(this.storage.get(this.key)).pipe(
      flatMap((token) => {
        return of(token);
      }),
    );
  }

  /**
   * Check if the token exists, if so send true to the notifier.
   * For development purposes so we don't have to log in to the
   * app every time we hot reload
   */
  pokeToken() {
    return of(this.initialized).pipe(
      flatMap((initialized) => {
        if (initialized) {
          return of(null);
        }
        return fromPromise(this.storage.get(this.key));
      }),
      flatMap((token) => {
        if (token) {
          this.initialized = true;
          this.notifier.next(true);
          this.authenticationState.next(true);
          //this.navigateHome();
          return token;
        }
        return of(null);
      })
    );
  }

  setToken(token: string) {
    return fromPromise(this.storage.set(this.key, token)).pipe(
      flatMap(() => {
        this.notifier.next(true);
        this.authenticationState.next(true);
        return of(null);
      })
    );
  }

  /** Delete token and user related info */
  deleteToken() {
    return fromPromise(this.storage.remove(this.key)).pipe(
      flatMap(() => {
        this.notifier.next(false);
        return fromPromise(this.deleteUserInfo());
      }),
    );
  }

  /** Delete all info in storage */
  async deleteUserInfo() {
    return of (this.subjects.clearStorage());
  }

  isLoggedIn(): Observable<boolean> {
    return this.notifier.asObservable();
  }

  navigateHome() {
    this.router.navigateByUrl('/');
  }
  
  navigateLogin() {
    this.router.navigateByUrl('/login');
  }
}
