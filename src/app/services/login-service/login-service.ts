import { Injectable } from '@angular/core';
import { TokenService } from '../token-service/token.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PresentationUrlEndpointInfo } from '../../../common/Http';
import { flatMap, catchError } from 'rxjs/operators';
import { AlertController, ToastController } from '@ionic/angular';
import { UserServices } from '../userservices/userservices';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
  constructor(private token: TokenService, private http: HttpClient, private alertController: AlertController, private toast: ToastController, private userServices: UserServices) {
  }

  doLogin(accountInfo) {
    return this.http.post(PresentationUrlEndpointInfo.loginUrl, accountInfo, { observe: 'response' }).pipe(
      flatMap((httpResponse: HttpResponse<ArrayBuffer>) => {
        const token = httpResponse.body["token"];
        return this.token.setToken(token);
      }),
      catchError((httperror: HttpErrorResponse) => {
        if(!httperror.error.data) return this.userServices.showAlert('No network detected', 'Network Error');
        return this.showToast(httperror.error.data.message);
      }),
    );
  }

  async showToast(message: string, callback?: Function) {
    this.toast.create({
      message: message,
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'bottom'
    }).then((t) =>{
      t.present();
    });
  }
}
