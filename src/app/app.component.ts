import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

import { environment } from '../environments/environment'
import { TokenService } from './services';
import { distinctUntilChanged, flatMap, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  loggedIn = this.token.isLoggedIn().pipe(
    debounceTime(500),
    distinctUntilChanged(),
    flatMap((authenticated) => {
      this.handleTokenState(authenticated);
      return of(null);
    }),
  );

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen, 
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private token: TokenService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();

      //One signal init
      this.oneSignal.startInit(environment.ONESIGNAL_APP_ID);

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.endInit();
    });
  }

  handleTokenState(authenticated) {
    if(authenticated) {
      this.token.navigateHome();
    } else {
      this.token.navigateLogin();
    }
  }
  
}
