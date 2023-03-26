import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonInputComponent } from '../../inputs/common-input/common-input.component';

@Component({
  selector: 'button-simple',
  templateUrl: './button-simple.component.html',
  styleUrls: ['./button-simple.component.css']
})
export class ButtonSimpleComponent extends CommonInputComponent {
  @Input()
  bLabel: String = '';
  @Input()
  componentID: String = '';
  @Input()
  shClass: String = '';

  override ngOnInit(): void {
    super.ngOnInit();
  }

  onChangeDetect(event: any) {
    let data: {[key: string]: any} = {
      event: event,
      id: this.componentID
    }
    this.onChangeDetected(data);
  }

}
