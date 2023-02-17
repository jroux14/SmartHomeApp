import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../common/common/common.component';

@Component({
  selector: 'sh-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent extends CommonComponent {

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
