import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { ImageService } from './../../services/image.service';
import { ValidateService } from './../../services/validate.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  img: Image;
  images1: Object[];
  images2: Object[];

  owner: Object;
  showAdd: Boolean;

  constructor(
    private router: Router,
    private _flashMessagesService: FlashMessagesService,
    private _imageService: ImageService,
    private _validateService: ValidateService,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this._imageService.getImages().subscribe(data => {
      let amountPerCol = Math.ceil(data.images.length / 2);

      this.images1 = data.images.slice(0, amountPerCol);
      this.images2 = data.images.slice(amountPerCol, data.images.length);

      this.showAdd = false;
      this.img = {
        url: '',
        name: '',
        owner: '',
        public: true,
        description: '',
        sharedWith: []
      }
    },
    err => {
      return false;
    })

    this.owner = localStorage.getItem('user');
  }

  onSubmitAdd() {
    const newImage = {
      url: this.img.url,
      name: this.img.name,
      owner: this.owner,
      public: this.img.public,
      description: this.img.description,
      sharedWith: this.img.sharedWith
    }

    if (!this._validateService.validateEdit(newImage)) {
      this._flashMessagesService.show('Please fill in all the fields.', { cssClass: 'card-panel red white-text' });
      return false;
    }

    this._imageService.createImage(newImage).subscribe(data => {
      if (data.ok) {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel green white-text' });
        this.showAdd = !this.showAdd;
      } else {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel red white-text' });
      }
    }, e => console.log(e));
  }

}

interface Image {
  url: String,
  name: String,
  owner: String,
  public: Boolean,
  description: String,
  sharedWith: String[]
}
