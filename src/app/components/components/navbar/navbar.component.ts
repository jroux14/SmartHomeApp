import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../common/common/common.component';

@Component({
  selector: 'sh-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent extends CommonComponent {

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
