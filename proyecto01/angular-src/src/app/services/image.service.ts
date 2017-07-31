import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment }  from './../../environments/environment';

@Injectable()
export class ImageService {

  authToken: any;

  constructor(
    private _http: Http,
  ) {
    this.authToken = localStorage.getItem('id_token')
  }

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

  getImage(imageId) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this._http.get(environment.apiUrl + 'images/' + imageId, { headers: headers })
      .map(res => res.json());
  }

  updateImage(image) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this._http.put(environment.apiUrl + 'images/' + image._id, image, { headers: headers })
      .map(res => res.json());
  }

  deleteImage(image) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this._http.delete(environment.apiUrl + 'images/' + image._id, { headers: headers })
      .map(res => res.json());
  }

}
