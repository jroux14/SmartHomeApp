import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { shUser } from 'src/app/interfaces/user.interface';
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
    if (this.authService.checkToken()) {
      this.authService.verifyUserToken().subscribe(resp => {
        let devices: any[] = resp.devices;
        
        if (resp.success) {
          if (resp.user) {
            this.authService.setCurrentUser(resp.user)
          }
          if (devices) {
            devices.forEach((device) => {
              this.deviceService.addDevice(device);
            })
          }
        }
      });
    } else {
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

  createNewDevice() {
    if (this.sideNav) {
      this.sideNav.toggle();
    }
    this.popupService.openPopup(NewDevicePopupComponent, {
      panelClass: 'baseDialog'
    });
  }
}
