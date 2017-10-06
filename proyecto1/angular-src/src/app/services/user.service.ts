import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { environment }  from './../../environments/environment';

@Injectable()
export class UserService {

  authToken: any;
  user: any;
  basePath: any;

  constructor(private _http: Http) { }

  registerUser(user) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this._http.post(environment.apiUrl + 'users', user, { headers: headers })
      .map(res => res.json());
  }

  authenticateUser(user) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this._http.post(environment.apiUrl + 'users/login', user, { headers: headers })
      .map(res => res.json());
  }

  getProfile() {
    const headers = new Headers();
    this.loadToken();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this._http.get(environment.apiUrl + 'users/login', { headers: headers })
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  deleteUser(user) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this._http.delete(environment.apiUrl + 'users/' + user.id, { headers: headers })
      .map(res => res.json());
  }

  updateUser(user) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this._http.put(environment.apiUrl + 'users/' + user.id, user, { headers: headers })
      .map(res => res.json());
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }
}
