import { Component } from '@angular/core';
import { UserServices } from 'src/app/services/userservices/userservices';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private userServices: UserServices
  ) {}

  ionViewWillEnter() {
    this.userServices.getUserSession().subscribe();
  }
}
