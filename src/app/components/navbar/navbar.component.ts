import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonComponent } from '../common/common/common.component';
import { LoginPopupComponent } from '../common/popup/login-popup/login-popup.component';

@Component({
  selector: 'sh-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent extends CommonComponent {
  sideNav: MatSidenav | undefined;

  userName: string = '';
  loggedIn: boolean = this.authService.currentUser ? true : false;

  override ngOnInit(): void {
    super.ngOnInit();

    if(this.dataService.getSideNav()) {
      this.sideNav = this.dataService.getSideNav();
    }
    if(this.authService.currentUser) {
      this.userName = this.authService.currentUser.firstName;
      this.loggedIn = true;
    }
    this.addSubscription(this.dataService.userChangeEmitter.subscribe(data => {
      if(this.authService.currentUser) {
        this.userName = this.authService.currentUser.firstName;
        this.loggedIn = true;
      } else {
        this.userName = '';
        this.loggedIn = false;
        this.popupService.openPopup(LoginPopupComponent, {         
          panelClass: 'loginDialog',
          disableClose: true})
        }
    }));
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.dataService.sideNavSubject.subscribe(resp => {
      if (resp) {
        this.sideNav = resp
      }
    });
  }

  toggleSideNav() {
    if (this.sideNav) {
      this.sideNav.toggle();
    }
  }

  logout() {
    this.loggedIn = false;
    this.authService.setCurrentUser(undefined);
    this.dataService.userChangeEmitter.emit();
  }
}
