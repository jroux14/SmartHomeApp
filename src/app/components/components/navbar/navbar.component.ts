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

  override ngOnInit(): void {
    super.ngOnInit();
    console.log(this.showLogin);
  }

  createNewDevice() {
    
  }

}
