import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { ImageService } from './../../services/image.service';
import { ValidateService } from './../../services/validate.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  image: any;
  user: any;
  showOptions: Boolean;
  showDelete: Boolean;
  showEdit: Boolean;

  constructor(
    private _imageService: ImageService,
    private _validateService: ValidateService,
    private _flashMessagesService: FlashMessagesService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.showDelete = false;
    this.showEdit = false;

    this.user = JSON.parse(localStorage.getItem('user'));

    this.route.paramMap
      .switchMap((params: ParamMap) => this._imageService.getImage(params.get('id')))
      .subscribe(data => {
        let owner = JSON.parse(data.image.owner);
        this.image = data.image;

        if (owner.id == this.user.id) {
          this.showOptions = true;
        } else {
          this.showOptions = false;
        }
      });
  }

  onDeleteConfirmed() {
    this._imageService.deleteImage(this.image).subscribe(data => {
      if (data.ok) {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel green white-text' });
        this.location.back();
        return false;
      } else {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel red white-text' });
        return false;
      }
    })
  }

  onSubmitEdit() {
    if (!this._validateService.validateEditPost(this.image)) {
      this._flashMessagesService.show('Please fill in the name field.', { cssClass: 'card-panel red white-text' });
      return false;
    }

    let editedImage = { ...this.image, owner: JSON.stringify(this.image.owner) };

    this._imageService.updateImage(this.image).subscribe(data => {
      if (data.ok) {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel green white-text' });
      } else {
        this._flashMessagesService.show(data.message, { cssClass: 'card-panel red white-text' });
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
