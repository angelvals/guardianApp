import { Component } from '@angular/core';
import { TokenService } from 'src/app/services';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  pushEnabled: boolean = false;

  constructor(
    private token: TokenService
  ) {}

  toggleTouch(event) {
    if (!this.pushEnabled) {
      //this.biometricService.disableTouch();
    } else {
      //this.biometricService.enableTouch();
    }
  }

  logOut() {
    this.token.deleteToken().subscribe(()=>{
      this.token.navigateLogin();
    });
  }

}
