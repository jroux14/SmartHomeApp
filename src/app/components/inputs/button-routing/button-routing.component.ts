import { Component, Input, OnInit } from '@angular/core';
import { CommonInputComponent } from '../../inputs/common-input/common-input.component';

@Component({
  selector: 'button-routing',
  templateUrl: './button-routing.component.html',
  styleUrls: ['./button-routing.component.css']
})
export class ButtonRoutingComponent extends CommonInputComponent {
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
