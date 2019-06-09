import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { UserServices } from '../../services/userservices/userservices';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    private http: HttpClient,
    private oneSignal: OneSignal,
    private userServices: UserServices
  ) {}

  ionViewDidEnter() {
    this.oneSignal.getIds().then((ids)=>{
      //Register userId with user
      console.log(ids);
    });
  }

  register() {
    //this.oneSignal.setSubscription(true);   
  }

  newPush(form) {
    this.oneSignal.getIds().then((ids)=>{
      const data = { 
        players: [ids.userId], 
        heading: form.value.header,
        text: form.value.text,
        data: {}
      };
      this.userServices.sendPush(data).pipe(
        map((response: any) => {
          form.reset();
          return of (null);
        })
      ).subscribe();
    });
  }

  unregister() {
    //this.oneSignal.setSubscription(false);
  }

}
