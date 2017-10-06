import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if(user.name == undefined || user.email == undefined ||
      user.username == undefined || user.password == undefined) {
        return false;
      } else {
        return true;
      }
  }

  validateLogin(user) {
    if (user.username == undefined || user.password == undefined) {
      return false;
    } else {
      return true;
    }
  }

  validateEditProfile(user) {
    if (user.name == '' || user.password == '' || user.email == '') {
      return false;
    } else {
      return true;
    }
  }

  validatePost(image) {
    if (image.name == '' || image.url == '') {
      return false;
    } else {
      return true;
    }
  }

  validateEditPost(image) {
    if (image.name == '') {
      return false;
    } else {
      return true;
    }
  }

  validateAdd(image) {
    if (image.name == '' || image.url == '' || image.owner == '' || image.public == null) {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.email);
  }

}
