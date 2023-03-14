import { Component, OnInit, Input } from '@angular/core';
import { CommonComponent } from '../common/common.component';
import { DropDownAnimation } from 'src/app/animations/animations';

@Component({
  selector: 'sh-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  animations: [ DropDownAnimation ]
})
export class DropdownComponent extends CommonComponent {
  @Input() 
  showLogin: boolean = false;
  
  links: string[] = ['', 'settings'];
  linkText: string[] = ['Dashboard', 'Settings'];
  linkIcons: string[] = ['dashboard', 'settings'];
  isOpen: boolean = false;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if(this.isOpen) {
      this.dataService.menuOpened.emit();
    }
  }

  onLogin() {
    this.dataService.openLoginPopup.emit();
  }

}
