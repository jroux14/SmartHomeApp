import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '../common/common/common.component';
import { LoginPopupComponent } from '../common/popup/login-popup/login-popup.component';
import { NewUserPopupComponent } from '../common/popup/newuser-popup/newuser-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends CommonComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  loginRef: MatDialogRef<any> | undefined;
  createUserRef: MatDialogRef<any> | undefined;

  override ngOnInit() {
    super.ngOnInit();
    this.addSubscription(this.dataService.openLoginEmitter.subscribe(resp => {
      this.loginRef = this.dialog.open(LoginPopupComponent, {
        panelClass: 'loginDialog'
      });
    }));
    this.addSubscription(this.dataService.closeLoginEmitter.subscribe(resp => {
      if(this.loginRef) {
        this.loginRef.close()
      }
    }));
    this.addSubscription(this.dataService.openNewAccountEmitter.subscribe(resp => {
      this.createUserRef = this.dialog.open(NewUserPopupComponent, {
        panelClass: 'newAccountDialog'
      });
    }));
    this.addSubscription(this.dataService.closeNewAccountEmitter.subscribe(resp => {
      if(this.createUserRef) {
        this.createUserRef.close()
      }
    }))
  }
}
