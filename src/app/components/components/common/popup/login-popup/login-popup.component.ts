import { ComponentType } from '@angular/cdk/portal';
import { Component, Input } from '@angular/core';
import { CommonComponent } from '../../common/common.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'sh-login',
  templateUrl: 'login-popup.component.html',
  styleUrls: ['login-popup.component.css'],
})
export class LoginPopupComponent extends CommonComponent {

  currentUsername: String = '';
  currentPassword: String = '';

  override ngOnInit(): void {
      super.ngOnInit();
      this.addSubscription(this.dataService.changeDetected.subscribe(resp => {
        if(resp.id == 'userInput') {
          this.currentUsername = resp.value;
        }
        else if(resp.id == 'pwdInput') {
          this.currentPassword = resp.value;
        }
        else if(resp.id == 'loginBtn') {
          this.loginSubmitted();
        }
      }))
  }

  loginSubmitted() {
    console.log('Logging in with credentials: \nUsername: %s\nPassword: %s', this.currentUsername, this.currentPassword);
  }

}
