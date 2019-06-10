import { Component } from '@angular/core';
import { UserServices } from '../../services/userservices/userservices';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  players: any = [];
  latitude: number = 0;
  longitude: number = 0;

  constructor(
    private userServices: UserServices,
    private geolocation: Geolocation
  ) {}

  ionViewDidEnter() {
    this.players = [];
    this.userServices.getAllUsers().pipe(
      map((response: any) => {
        response.map((user: any) => {
          if(user.PushToken) this.players.push(user.PushToken)
        });
        return of (null);
      })
    ).subscribe();

    this.getLocation();
  }

  getLocation() {
    const options = {
      enableHighAccuracy: true,  // use GPS
      maximumAge        : 30000, // milliseconds e.g., 30000 === 30 seconds
      timeout           : 27000  // milliseconds
    };
  
    this.geolocation.getCurrentPosition(options).then((resp) => {
      console.log(resp);
      if(resp.coords){
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
      }
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  newPush(form) {
    const data = { 
      players: this.players, 
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
  }

  unregister() {
    //this.oneSignal.setSubscription(false);
  }

}
