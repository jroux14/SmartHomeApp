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
  currentUsername: string = '';
  currentPassword: string = '';
  fillAllWarning: boolean = false;
  badCredentials: boolean = false;
  updateUsernameEmitter: EventEmitter<any> = new EventEmitter();
  updatePasswordEmitter: EventEmitter<any> = new EventEmitter();
  checkLoginEmitter: EventEmitter<any> = new EventEmitter();

  override ngOnInit(): void {
      super.ngOnInit();
      this.addSubscription(this.updateUsernameEmitter.subscribe(resp => {
        this.currentUsername = resp.value;
      }));
      this.addSubscription(this.updatePasswordEmitter.subscribe(resp => {
        this.currentPassword = resp.value;
      }));
      this.addSubscription(this.checkLoginEmitter.subscribe(resp => {
        this.addSubscription(this.authService.attemptLogin(this.currentUsername, this.currentPassword).subscribe(resp => {
          console.log(resp);
          if(resp.success && resp.user) {
            this.authService.setCurrentUser(resp.user);
            this.dataService.userChangeEmitter.emit();
            this.dataService.closeLoginEmitter.emit();
          } else {
            this.fillAllWarning = resp.fillAllError;
            this.badCredentials = resp.badCredentialsError;
          }
        }));
      }))
  }

  createAcct() {
    this.dataService.closeLoginEmitter.emit();
    this.dataService.openNewAccountEmitter.emit();
  }

}
