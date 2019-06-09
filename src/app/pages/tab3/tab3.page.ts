import { Component } from '@angular/core';
import { TokenService } from 'src/app/services';
import { UserServices } from 'src/app/services/userservices/userservices';
import { map, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  pushEnabled: boolean = false;
  pushToken: string;

  constructor(
    private token: TokenService,
    private userServices: UserServices,
    private onesignal: OneSignal
  ) {}

  ionViewWillEnter() {
    this.getUser();
    this.onesignal.getIds().then((ids)=>{
      this.pushToken = ids.userId;
    })
  }

  getUser() {
    this.userServices.getUserSession().pipe(
      map((response: any) => {
        this.pushEnabled = !!response.PushToken;
        return of (null);
      })
    ).subscribe();
  }

  toggleTouch(event) {
    if (!this.pushEnabled) {
      this.userServices.unRegisterPush({ pushToken: this.pushToken }).pipe(
        map((response: any) => {
          this.getUser();
          return of (null);
        })
      ).subscribe();
      //this.biometricService.disableTouch();
    } else {
      if(!this.pushToken) {
        this.userServices.showAlert('Error getting push token');
        setTimeout(()=> this.pushEnabled = false, 300);
      } else {
        this.userServices.registerPush({ pushToken: this.pushToken }).pipe(
          map((response: any) => {
            this.getUser();
            return of (null);
          })
        ).subscribe();
      }
      //this.biometricService.enableTouch();
    }
  }

  logOut() {
    this.userServices.logOut().pipe(
      flatMap((response: any) => {
        return this.token.deleteToken()
      }),
      flatMap((response: any) => {
        this.token.navigateLogin();
        return of(null);
      })
    ).subscribe();
  }

}
