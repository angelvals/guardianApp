import { Component } from '@angular/core';
import { UserServices } from '../../services/userservices/userservices';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  players: any = [];
  latitude: number = 0;
  longitude: number = 0;
  subscription: any;

  options = {
    enableHighAccuracy: true,  // use GPS
    maximumAge        : 3000, // milliseconds e.g., 30000 === 30 seconds
    timeout           : 3000  // milliseconds
  };

  constructor(
    private userServices: UserServices,
    private geolocation: Geolocation,
    private loadingController: LoadingController
  ) {}

  ionViewDidEnter() {
    this.latitude = 0;
    this.longitude = 0;
    this.players = [];
    //this.getLocation();
  }

  getLocation() {
    //TODO add listener on gps on
    this.geolocation.getCurrentPosition(this.options).then((resp) => {
      if(resp.coords){
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
      }
    }).catch((error) => {
      console.log('Error getting location', error);
    }).finally(()=>{
      let watch = this.geolocation.watchPosition(this.options);
      this.subscription = watch.subscribe((data) => {
        if(data.coords){
          this.latitude = data.coords.latitude;
          this.longitude = data.coords.longitude;
        }
      });
    })
  }

  newPush(form) {
    //TODO add listener on gps on
    this.loadingController.create().then((load => {
      load.present();
    }));
    this.geolocation.getCurrentPosition(this.options).then((resp) => {
      if(resp.coords){
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        const data = { 
          players: [], 
          Header: form.value.header,
          Content: form.value.text,
          Latitude: this.latitude,
          Longitude: this.longitude,
          Legacy: 0,
          data: {}
        };
        this.userServices.sendPush(data).pipe(
          map((response: any) => {
            form.reset();
            return of (null);
          })
        ).subscribe();
      }
    }).catch((error) => {
      this.userServices.showAlert(error.message, 'Error getting location');
    }).finally(()=>{
      this.loadingController.dismiss();
    })
  }

  unregister() {
    //this.oneSignal.setSubscription(false);
  }

  ionViewWillLeave() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      console.error(error);
    }
  }

}
