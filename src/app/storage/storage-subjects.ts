import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageSubjects{
  //Storage keys
  readonly tokenKey: string = 'X-Bearer-Token';
  readonly biometricKey: string = 'biometric-token';
  readonly notificationKey: string = 'notifications-status';

  //BehaviorSubjects
  authenticationState = new BehaviorSubject<boolean>(true);

  constructor(private storage: Storage) {}

  async clearStorage() {
    this.authenticationState.next(false);

    return Promise.all([
      this.storage.remove(this.tokenKey),
      //this.storage.remove(this.biometricKey),
      this.storage.remove(this.notificationKey)
    ])
  }

}