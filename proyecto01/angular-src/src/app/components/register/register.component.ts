import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { ValidateService } from './../../services/validate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private _validateService: ValidateService,
    private _userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmitRegister() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    };
    
    if (!this._validateService.validateRegister(user)) {
      this._flashMessagesService.show('Please fill all the fields.', { cssClass: 'card-panel red white-text' });
      return false;
    }

    if(!this._validateService.validateEmail(user.email)) {
      this._flashMessagesService.show('Please enter a valid email.', { cssClass: 'card-panel red white-text' });
      return false;
    }

    this._userService.registerUser(user).subscribe(data => {
      if(data.success) {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel red white-text' });
        this.router.navigate(['login']);
      } else {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel green white-text' });
      }
    });
  }
}