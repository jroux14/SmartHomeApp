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
  @Output()
  changeEmitter = new EventEmitter<any>();

  override ngOnInit(): void {
    super.ngOnInit();
  }

  onChangeDetect(event: any) {
    this.dataService.changeDetected.emit(event);
  }

}
