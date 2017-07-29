import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { UserService } from './../../services/user.service';
import { ValidateService } from './../../services/validate.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object;
  showDelete: boolean;
  showEdit: boolean;

  constructor(
    private _userService: UserService,
    private _validateService: ValidateService,
    private _flashMessagesService: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.showDelete = false;
    this.showEdit = false;
    this._userService.getProfile().subscribe(data => {
      this.user = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        description: data.user.description,
        username: data.user.username,
        password: data.user.password
      };
    },
    err => {
      return false;
    })
  }

  onDeleteConfirmed() {
    this._userService.deleteUser(this.user).subscribe(data => {
      if (data.ok) {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel green white-text' });
        this._userService.logout();
        this.router.navigate(['']);
        return false;
      } else {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel red white-text' });
        this.router.navigate(['profile']);
      }
    })
  }

  onSubmitEdit() {
    if (!this._validateService.validateEdit(this.user)) {
      this._flashMessagesService.show('Please fill in all the fields.', { cssClass: 'card-panel red white-text' });
      return false;
    }

    if (!this._validateService.validateEmail(this.user)) {
      this._flashMessagesService.show('Please enter a valid email.', { cssClass: 'card-panel red white-text' });
      return false;
    }

    this._userService.updateUser(this.user).subscribe(data => {
      if (data.ok) {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel green white-text' });
      } else {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel red white-text' });
      }
    });
  }
}
