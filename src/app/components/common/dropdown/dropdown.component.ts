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
  
  userName: string = 'Login';
  links: string[] = ['', 'settings'];
  linkText: string[] = ['Dashboard', 'Settings'];
  linkIcons: string[] = ['dashboard', 'settings'];
  isOpen: boolean = false;

  override ngOnInit(): void {
    super.ngOnInit();
    this.addSubscription(this.dataService.userChangeEmitter.subscribe(resp => {
      if(this.authService.currentUser) {
        this.userName = this.authService.currentUser.fName;
      } else {
        this.userName = 'Login';
      }
    }));
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if(this.isOpen) {
      this.dataService.dropdownEmitter.emit();
    }
  }

  onLogin() {
    this.dataService.openLoginEmitter.emit();
  }
}
