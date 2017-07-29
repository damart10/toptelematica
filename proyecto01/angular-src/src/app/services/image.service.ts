import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment }  from './../../environments/environment';

@Injectable()
export class ImageService {

  constructor(
    private _http: Http,
  ) { }

  getImages() {
    return this._http.get(environment.apiUrl + 'images')
      .map(res => res.json())
  }

  createImage(image) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this._http.post(environment.apiUrl + 'images', image, { headers: headers })
      .map(res => res.json());
  }

}
