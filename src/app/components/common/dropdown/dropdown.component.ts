import { Component, OnInit, Input } from '@angular/core';
import { CommonComponent } from '../common/common.component';
import { DropDownAnimation } from 'src/app/animations/animations';
import { LoginPopupComponent } from '../popup/login-popup/login-popup.component';

@Component({
  selector: 'sh-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  animations: [ DropDownAnimation ]
})
export class DropdownComponent extends CommonComponent {
  @Input() 
  showLogin: boolean = false;
  
  loggedIn: boolean = false;
  showLogout: boolean = false;
  userName: string = 'Login';
  links: string[] = ['', 'settings'];
  linkText: string[] = ['Dashboard', 'Settings'];
  linkIcons: string[] = ['dashboard', 'settings'];
  isOpen: boolean = false;

  override ngOnInit(): void {
    super.ngOnInit();
    this.addSubscription(this.dataService.userChangeEmitter.subscribe(resp => {
      if(this.authService.currentUser) {
        this.userName = this.authService.currentUser.firstName;
        this.loggedIn = true
      } else {
        this.userName = 'Login';
        this.loggedIn = false;
      }
    }));
  }

  toggle() {
    this.isOpen = !this.isOpen;
    // if(this.isOpen) {
    //   this.dataService.dropdownEmitter.emit();
    // }
  }

  onLogin() {
    if(this.loggedIn) {
      this.showLogout = !this.showLogout;
    } else {
      this.dataService.openLoginEmitter.emit();
    }
  }

  logout() {
    this.showLogout = false;
    this.loggedIn = false;
    this.authService.setCurrentUser(undefined);
    this.dataService.userChangeEmitter.emit();
  }
}
