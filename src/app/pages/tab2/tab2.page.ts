import { Component } from '@angular/core';
import { UserServices } from '../../services/userservices/userservices';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  players: any = []

  constructor(
    private userServices: UserServices
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
