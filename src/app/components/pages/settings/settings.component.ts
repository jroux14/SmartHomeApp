import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../../common/common/common.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends CommonComponent {

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
