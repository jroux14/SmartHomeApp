import { Component, Input, OnInit } from '@angular/core';
import { CommonComponent } from '../../components/common/common/common.component';

@Component({
  selector: 'button-routing',
  templateUrl: './button-routing.component.html',
  styleUrls: ['./button-routing.component.css']
})
export class ButtonRoutingComponent extends CommonComponent {
  @Input()
  bLabel: String = 'Test';
  @Input()
  bLink: String = '';

  override ngOnInit(): void {
    super.ngOnInit();
  }

  getLink(): String {
    return this.bLink;
  }

}
