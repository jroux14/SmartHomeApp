import { Component, OnInit, Input } from '@angular/core';
import { CommonComponent } from '../common/common/common.component';

@Component({
  selector: 'sh-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent extends CommonComponent {
  @Input() 
  showLogin: boolean = false;
  loggedIn: boolean = this.authService.currentUser ? true : false;

  override ngOnInit(): void {
    super.ngOnInit();
    this.addSubscription(this.dataService.userChangeEmitter.subscribe(resp => {
      this.loggedIn = this.authService.currentUser ? true : false;
    }));
  }

  createNewDevice() {
    this.dataService.addDeviceEmitter.emit();
  }

}
