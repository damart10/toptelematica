import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private _userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLogoutClick() {
    this._userService.logout();
    this._flashMessagesService.show('You are logged out.', { cssClass: 'card-panel green white-text' });
    this.router.navigate(['']);
    return false;
  }

}
