import { Injectable } from '@angular/core';
import { HttpService } from '../index';
import { PresentationUrlEndpointInfo } from '../../../common/Http';

import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UserServices {

    constructor(private http: HttpService, private alertController: AlertController) { }

    getUserSession() {
        return this.http.get(PresentationUrlEndpointInfo.keys.usersession);
    }

    getAllUsers() {
        return this.http.get(PresentationUrlEndpointInfo.keys.users);
    }

    logOut() {
        return this.http.get(PresentationUrlEndpointInfo.keys.logout);
    }

    registerPush(data: object) {
        return this.http.post(PresentationUrlEndpointInfo.keys.registerPush, data);   
    }
    
    unRegisterPush(data: object) {
        return this.http.post(PresentationUrlEndpointInfo.keys.unRegisterPush, data);   
    }

    sendPush(data: object) {
        return this.http.post(PresentationUrlEndpointInfo.keys.sendPush, data);
    }

    getPost() {
        return this.http.get(PresentationUrlEndpointInfo.keys.post);
    }

    deletePost(data: any) {
        return this.http.delete(`${PresentationUrlEndpointInfo.keys.post}/${data.id}`);
    }

    //alerts
    async showAlert(message: string, title: string = 'Unhandled error') {
        const alert = await this.alertController.create({
          header: title,
          message: message,
          buttons: ['OK']
        });
        await alert.present();
    }
}
