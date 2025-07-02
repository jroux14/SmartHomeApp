import { Component } from '@angular/core';
import { CommonComponent } from '../common/common/common.component';
import {shDevice} from "../../interfaces/device.interface";
import {shRoom} from "../../interfaces/room.interface";
import {LoginPopupComponent} from "../common/popup/login-popup/login-popup.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends CommonComponent {
  // title(title: any) {
  //   throw new Error('Method not implemented.');
  // }

  override ngOnInit() {
    super.ngOnInit();

    if (!this.authService.getCurrentUser()) {
      this.popupService.openPopup(LoginPopupComponent, {
        panelClass: 'loginDialog',
        disableClose: true
      });
    }
  }
}
