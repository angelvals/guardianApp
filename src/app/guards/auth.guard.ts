import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageSubjects } from '../storage/storage-subjects';
import { TokenService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  authenticationState = this.subjects.authenticationState;

  constructor(
    private subjects: StorageSubjects, 
    private token: TokenService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.authenticationState.value) this.token.navigateLogin();
    return this.authenticationState.value;
  }
}