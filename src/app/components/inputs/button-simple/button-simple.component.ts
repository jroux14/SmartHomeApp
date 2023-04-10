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
  @Input()
  shIcon: string | undefined;
  @Input()
  emitterData: any;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  onChangeDetect(event: any) {
    let rVal: any;
    if(this.emitterData) {
      this.emitterData.event = event;
      rVal = this.emitterData
    } else {
      rVal = {
        event: event,
        id: this.componentID
      }
    }
    this.onChangeDetected(rVal);
  }

}
