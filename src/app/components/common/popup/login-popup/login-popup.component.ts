import { ComponentType } from '@angular/cdk/portal';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '../../common/common.component';
import { shUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'sh-login',
  templateUrl: 'login-popup.component.html',
  styleUrls: ['login-popup.component.css'],
})
export class LoginPopupComponent extends CommonComponent {
  isNewUser: boolean = false;
  firstName: string = '';
  email: string = 'test';
  phoneNum: string = 'test';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  authed: boolean = false;
  tokenTest: string = ''

  attemptLogin() {
    if (this.areFieldsComplete()) {
      if (this.isNewUser) {
        if (this.password != this.confirmPassword) {
          // Passwords must match
        } else {
          let userData = {
            "username": this.username,
            "password": this.password,
            "firstName": this.firstName,
            "email": this.email,
            "phone": this.phoneNum
          };


          this.authService.registerNewUser(userData).subscribe(resp => {
            if(resp.success) {
              this.isNewUser = false;
            }
          });
        }
      } else {
        let userData = {
          "username": this.username,
          "password": this.password
        };

        this.authService.attemptLogin(userData).subscribe(resp => {
          if (resp.success) {
            if (resp.token && resp.user) {
              let user = resp.user;
              localStorage.setItem("token", resp.token);
              let newUser: shUser = new shUser(user.userId, user.firstName, user.email, user.phoneNum);
              this.authService.setCurrentUser(newUser);
              this.dataService.userChangeEmitter.emit();
              this.popupService.closePopup();
            } else {
              // TODO: failed to get JWT token
            }
          }
        });
      }
    } else {
      // Need all fields to be complete
    }
  }

  areFieldsComplete(): boolean {
    if(this.isNewUser) {
      console.log("hello")
      if (this.firstName == '' || this.email == '' || this.phoneNum == '' || this.username == '' || this.password == '' || this.confirmPassword == '') {
        console.log('fail')
        return false;
      } else {
        return true;
      }
    } else {
      if (this.username == '' || this.password == '') {
        return false;
      } else {
        return true;
      }
    }
  }

  switchDisplay() {
    this.isNewUser = !this.isNewUser;
  }

}
