import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  url = "https://guardian92.herokuapp.com/push/";

  constructor(
    private http: HttpClient,
    private oneSignal: OneSignal
  ) {}

  ionViewDidEnter() {
    this.oneSignal.startInit(environment.ONESIGNAL_APP_ID);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });

    this.oneSignal.endInit();
  }

  register() {
    this.oneSignal.setSubscription(true);

    this.oneSignal.getIds().then((ids)=>{
      //Register userId with user
      console.log(ids);
    });
  }

  newPush(form) {
    this.oneSignal.getIds().then((ids)=>{
      this.http.post(this.url+"sendNotification", { 
        players: [ids.userId], 
        heading: form.value.header,
        text: form.value.text,
        data: {}
      }).subscribe((response) => {
        form.reset();
      });
    });
  }

  unregister() {
    this.oneSignal.setSubscription(false);
    this.oneSignal.getIds().then((ids)=>{
      //Register userId with user
      console.log(ids);
    });
  }

}
