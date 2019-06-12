import { Component } from '@angular/core';
import { UserServices } from 'src/app/services/userservices/userservices';
import { Socket } from 'ngx-socket-io';
import { flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  post: any = [];

  constructor(
    private userServices: UserServices,
    private socket: Socket
  ) {}

  ionViewWillEnter() {
    this.userServices.getUserSession().subscribe();
  }

  getPost(event?) {
    this.userServices.getPost().pipe(
      flatMap((response) => {
        this.post = response;
        if(event) event.target.complete();
        return of (null);
      })
    ).subscribe();
  }

  deletePost(post) {
    this.userServices.deletePost(post).pipe(
      flatMap(() => {
        this.getPost();
        return of (null);
      })
    ).subscribe();
  }

  ionViewDidEnter() {
    this.socket.fromEvent("newPost").subscribe( (data: any) => {
      let exists = false
      this.post.map((post: any) => exists = (post.id == data.id) );
      if(!exists) this.post.push(data);
    });
    this.getPost();
  }
}
