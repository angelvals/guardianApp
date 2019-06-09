import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  messages: string[] = [];
  isActive = false;

  constructor(public toastController: ToastController) {
  }

  /**
   * Show error in message data if it exists, otherwise display
   * a fallback message
   */
  presentStandardError(data: any, fallback: string) {
    if (data && data.data && data.data.message) {
      const title = data.data.title ? `${data.data.title}. ` : '';
      this.presentToast(title + data.data.message);
      return;
    }

    this.presentToast(fallback);
  }

  /**
   * Show toasts in a queue so that they don't overlap
   */
  presentToast(message: string) {
    if (message && !this.messages.includes(message)) {
      this.messages.push(message);
    }

    if (this.isActive || this.messages.length === 0) {
      return;
    }

    const currentMessage = this.messages.shift();
    this.toastController.create({
      message: currentMessage,
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'bottom',
      duration: 5000,
    }).then(toast => {
      toast.present();
      this.isActive = true;
      toast.onDidDismiss().then(() => {
        this.isActive = false;
      });
    });
  }
}
