import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  user: any;

  constructor(private _http: Http) { }

  registerUser(user) {
    let headers = new Headers();
    
    headers.append('Content-Type', 'application/json');
    
    return this._http.post('http://localhost:3000/api/user/create', user, { headers: headers })
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this._http.post('http://localhost:3000/api/user/login', user, { headers: headers })
      .map(res => res.json());
  }
}
