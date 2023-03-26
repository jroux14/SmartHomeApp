import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input } from '@angular/core';
import { CommonComponent } from '../../common/common.component';

@Component({
  selector: 'sh-login',
  templateUrl: 'newuser-popup.component.html',
  styleUrls: ['newuser-popup.component.css'],
})
export class NewUserPopupComponent extends CommonComponent {
  currentUser: string = '';
  currentPwd: string = '';
  confirmPwd: string = '';
  pwdMatchWarning: boolean = false;
  fillAllWarning: boolean = false;
  updateUsernameEmitter: EventEmitter<any> = this.dataService.updateUsernameEmitter;
  updatePasswordEmitter: EventEmitter<any> = this.dataService.updatePasswordEmitter;
  confirmPasswordEmitter: EventEmitter<any> = this.dataService.confirmPasswordEmitter;
  createUserEmitter: EventEmitter<any> = this.dataService.createUserEmitter;

  override ngOnInit(): void {
      super.ngOnInit();
      this.addSubscription(this.dataService.updateUsernameEmitter.subscribe(resp => {
        this.currentUser = resp.value;
      }));
      this.addSubscription(this.dataService.updatePasswordEmitter.subscribe(resp => {
        this.currentPwd = resp.value;
      }));
      this.addSubscription(this.dataService.confirmPasswordEmitter.subscribe(resp => {
        this.confirmPwd = resp.value;
      }));
      this.addSubscription(this.dataService.createUserEmitter.subscribe(resp => {
        this.createUser();
      }))
  }

  createUser() {
    if(this.currentUser != '' && this.currentPwd != '' && this.confirmPwd != '') {
      this.fillAllWarning = false;
      if (this.currentPwd == this.confirmPwd) {
        this.pwdMatchWarning = false;
        console.log('Creating user with credentials: \nUsername: %s\nPassword: %s', this.currentUser, this.currentPwd);
      } else {
        this.pwdMatchWarning = true;
      }
    } else {
      this.pwdMatchWarning = false;
      this.fillAllWarning = true;
    }
  }

  switchBack() {
    console.log("Create new account");
    this.dataService.closeNewAccountEmitter.emit();
    this.dataService.openLoginEmitter.emit();
  }
}
