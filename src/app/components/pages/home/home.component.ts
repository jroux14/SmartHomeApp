import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonComponent } from '../../common/common/common.component';
import { LoginPopupComponent } from '../../common/popup/login-popup/login-popup.component';
import { NewDevicePopupComponent } from '../../common/popup/newdevice-popup/newdevice-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CommonComponent{
  @ViewChild("sideNav") sideNav: MatSidenav | undefined;
  
  links: string[] = ['', 'settings'];
  linkText: string[] = ['Dashboard', 'Settings'];
  linkIcons: string[] = ['dashboard', 'settings'];
  responseData: String = '';
  testLogin: boolean = true;
  loginDialog: MatDialogRef<LoginPopupComponent> | null = null;

  override ngOnInit() {
    super.ngOnInit();
    if (!this.authService.currentUser) {
      this.popupService.openPopup(LoginPopupComponent, {
        panelClass: 'loginDialog',
        disableClose: true
      });
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.sideNav) {
      this.dataService.setSideNav(this.sideNav);
    }
  }
  
  testAuth() {
    this.authService.testAuth().subscribe(resp => {
      console.log(resp);
    });
  }

  testHttp(): void {
    var env = this;
    this.addSubscription(this.dataService.test().subscribe(resp => {
      console.log(resp.test);
      env.responseData = resp.test;
    }));
  }

  createNewDevice() {
    if (this.sideNav) {
      this.sideNav.toggle();
    }
    this.popupService.openPopup(NewDevicePopupComponent, {
      panelClass: 'baseDialog'
    });
  }
}
