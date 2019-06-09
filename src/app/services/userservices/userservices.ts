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
        return this.http.post(PresentationUrlEndpointInfo.keys.usersession);
    }

    sendPush(data: object) {
        return this.http.post(PresentationUrlEndpointInfo.keys.sendPush, data);
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
