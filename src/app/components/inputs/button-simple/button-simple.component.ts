import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonComponent } from '../../components/common/common/common.component';

@Component({
  selector: 'button-simple',
  templateUrl: './button-simple.component.html',
  styleUrls: ['./button-simple.component.css']
})
export class ButtonSimpleComponent extends CommonComponent {
  @Input()
  bLabel: String = '';
  @Input()
  componentID: String = '';

  override ngOnInit(): void {
    super.ngOnInit();
  }

  onChangeDetect(event: any) {
    let data: {[key: string]: any} = {
      event: event,
      id: this.componentID
    }
    this.dataService.changeDetected.emit(data);
  }

}
