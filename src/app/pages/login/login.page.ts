import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services';
import { first } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast-service/toast.service';
import { LoginService } from 'src/app/services/login-service/login-service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private token: TokenService,
    public formBuilder: FormBuilder,
    private toastService: ToastService,
    private loginService: LoginService
  ) { }

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.token.pokeToken().pipe(first()).subscribe();
  }

  doLogin() {
    const account ={
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }
    if (!account.username || !account.password) {
      this.toastService.presentToast('Please enter a valid username and password.');
      return;
    }
    this.loginService.doLogin(account).pipe(first()).subscribe();
  }

}
