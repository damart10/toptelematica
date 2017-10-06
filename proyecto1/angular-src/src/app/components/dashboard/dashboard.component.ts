import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { ImageService } from './../../services/image.service';
import { ValidateService } from './../../services/validate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  img: Image;
  images: Object[];
  images1: Object[];
  images2: Object[];

  owner: Object;
  showAdd: Boolean;
  showSearch: Boolean;

  search: any;

  constructor(
    private router: Router,
    private _flashMessagesService: FlashMessagesService,
    private _imageService: ImageService,
    private _validateService: ValidateService
  ) { }

  ngOnInit() {
    this._imageService.getImages().subscribe(data => {
      this.images = data.images;

      this.distributeImages();

      this.showAdd = false;
      this.showSearch = false;
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

    if (!this._validateService.validatePost(newImage)) {
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

  onSubmitSearch() {
    this._imageService.searchImage(this.search).subscribe(data => {
      if (data.ok && data.images.length != 0) {
        this.images = data.images;
        this.distributeImages();
        this.showSearch = false;
        this.search = '';
      } else {
        this._flashMessagesService.show('No results found.', { cssClass: 'card-panel red white-text' });
        this.showSearch = false;
      }
    })
  }

  distributeImages() {
    let amountPerCol = Math.ceil(this.images.length / 2);

    this.images1 = this.images.slice(0, amountPerCol);
    this.images2 = this.images.slice(amountPerCol, this.images.length);
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
