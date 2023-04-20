import { Component, EventEmitter } from '@angular/core';
import { CommonComponent } from '../../common/common.component';
import { v4 as uuidv4 } from 'uuid';
import { shUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'sh-login',
  templateUrl: 'newuser-popup.component.html',
  styleUrls: ['newuser-popup.component.css'],
})
export class NewUserPopupComponent extends CommonComponent{
  fNameEmitter: EventEmitter<any> = this.dataService.fNameEmitter;
  updateUsernameEmitter: EventEmitter<any> = this.dataService.updateUsernameEmitter;
  updatePasswordEmitter: EventEmitter<any> = this.dataService.updatePasswordEmitter;
  confirmPasswordEmitter: EventEmitter<any> = this.dataService.confirmPasswordEmitter;
  createUserEmitter: EventEmitter<any> = this.dataService.createUserEmitter;

  fName: string = '';
  currentUser: string = '';
  currentPwd: string = '';
  confirmPwd: string = '';
  pwdMatchWarning: boolean = false;
  fillAllWarning: boolean = false;
  userExistsWarning: boolean = false;
  
  override ngOnInit(): void {
      super.ngOnInit();
      this.addSubscription(this.dataService.fNameEmitter.subscribe(resp => {
        this.fName = resp.value;
      }));
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
        let newUID: string = uuidv4();
        let newUser: shUser = {
          userID: newUID,
          username: this.currentUser,
          firstName: this.fName,
          pwd: this.currentPwd
        };

        this.addSubscription(this.authService.registerNewUser(newUser,this.confirmPwd).subscribe(resp => {
          if(resp.success) {
            this.dataService.closeNewAccountEmitter.emit();
          } else {
            this.userExistsWarning = resp.userExistsError;
            this.fillAllWarning = resp.fillAllError;
            this.pwdMatchWarning = resp.passwordConfirmError;
          }
        }));
      }));
  }

  switchBack() {
    this.dataService.closeNewAccountEmitter.emit();
    this.dataService.openLoginEmitter.emit();
  }
}
