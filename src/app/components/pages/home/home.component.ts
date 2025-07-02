import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonComponent } from '../../common/common/common.component';
import {AddPanelPopup} from "../../common/popup/addpanel-popup/addpanel.popup";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CommonComponent{
  @ViewChild("sideNav") sideNav: MatSidenav | undefined;

  editMode: boolean = false;

  override ngOnInit() {
    super.ngOnInit();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.sideNav) {
      this.dataService.setSideNav(this.sideNav);
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  addPanel() {
    if (this.sideNav && this.sideNav.opened) {
      this.sideNav.toggle();
    }
    this.popupService.openPopup(AddPanelPopup, {
      panelClass: 'baseDialog'
    });
  }
}
