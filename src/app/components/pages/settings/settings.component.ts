import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonComponent } from '../../common/common/common.component';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends CommonComponent {
  @ViewChild("sideNav") sideNav: MatSidenav | undefined;

  links: string[] = ['', 'settings'];
  linkText: string[] = ['Dashboard', 'Settings'];
  linkIcons: string[] = ['dashboard', 'settings'];
  
  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.sideNav) {
      this.dataService.setSideNav(this.sideNav);
    }
  }
}
