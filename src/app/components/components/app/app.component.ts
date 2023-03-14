import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../common/common/common.component';
import { LoginPopupComponent } from '../common/popup/login-popup/login-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends CommonComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  override ngOnInit() {
    super.ngOnInit();
    this.addSubscription(this.dataService.openLoginPopup.subscribe(resp => {
      console.log('Logging In');
      this.dialog.open(LoginPopupComponent);
    }));
  }
}
