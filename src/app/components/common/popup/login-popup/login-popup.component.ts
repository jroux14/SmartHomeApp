import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '../../common/common.component';

@Component({
  selector: 'sh-login',
  templateUrl: 'login-popup.component.html',
  styleUrls: ['login-popup.component.css'],
})
export class LoginPopupComponent extends CommonComponent {
  globalThis: any = this;
  currentUsername: string = '';
  currentPassword: string = '';
  fillAllWarning: boolean = false;
  badCredentials: boolean = false;
  newUsernameEmitter: EventEmitter<any> = this.dataService.updateUsernameEmitter;
  newPasswordEmitter: EventEmitter<any> = this.dataService.updatePasswordEmitter;
  checkLoginEmitter: EventEmitter<any> = this.dataService.checkLoginEmitter;

  override ngOnInit(): void {
      super.ngOnInit();
      this.addSubscription(this.dataService.updateUsernameEmitter.subscribe(resp => {
        this.currentUsername = resp.value;
      }));
      this.addSubscription(this.dataService.updatePasswordEmitter.subscribe(resp => {
        this.currentPassword = resp.value;
      }));
      this.addSubscription(this.dataService.checkLoginEmitter.subscribe(resp => {
        this.loginSubmitted();
      }))
  }

  loginSubmitted() {
    if(this.currentUsername != '' && this.currentPassword != '') {
      this.fillAllWarning = false;
      console.log('Logging in with credentials: \nUsername: %s\nPassword: %s', this.currentUsername, this.currentPassword);
    } else {
      this.fillAllWarning = true;
    }
  }

  createAcct() {
    console.log("Create new account");
    this.dataService.closeLoginEmitter.emit();
    this.dataService.openNewAccountEmitter.emit();
  }

}
