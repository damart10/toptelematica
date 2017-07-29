import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { UserService } from './../../services/user.service';
import { ValidateService } from './../../services/validate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private _userService: UserService,
    private _validateService: ValidateService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmitLogin() {
    const user = {
      username: this.username,
      password: this.password
    };

    if (!this._validateService.validateLogin(user)) {
      this._flashMessagesService.show('Please fill all the fields.', { cssClass: 'card-panel red white-text' });
      return false;
    }

    this._userService.authenticateUser(user).subscribe(data => {
      if (data.ok) {
        this._userService.storeUserData(data.token, data.user);
        this.router.navigate(['dashboard']);
      } else {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel red white-text' });
        this.router.navigate(['login']);
      }
    });
  }
}
