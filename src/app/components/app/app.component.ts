import { Component, OnInit } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { CommonComponent } from '../common/common/common.component';
import { LoginPopupComponent } from '../common/popup/login-popup/login-popup.component';
import { NewDevicePopupComponent } from '../common/popup/newdevice-popup/newdevice-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends CommonComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  // createUserRef: MatDialogRef<any> | undefined;
  newDeviceRef: MatDialogRef<any> | undefined;

  override ngOnInit() {
    super.ngOnInit();
  }
}
