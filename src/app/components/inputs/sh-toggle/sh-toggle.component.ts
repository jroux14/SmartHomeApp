import { Component, Input } from '@angular/core';
import { CommonInputComponent } from '../common-input/common-input.component';

@Component({
  selector: 'sh-toggle',
  templateUrl: './sh-toggle.component.html',
  styleUrls: ['./sh-toggle.component.css']
})
export class ToggleComponent extends CommonInputComponent {
  @Input()
  tLabel: string = '';
  @Input()
  componentID: string = '';
  @Input()
  shState: boolean = false;
  @Input()
  shStateText: string = 'OFF';

  override ngOnInit(): void {
    super.ngOnInit();
  }

  changeDetected(event: any) {
    this.onChangeDetect(event);
  }

  onChangeDetect(event: any) {
    let rVal: boolean = false;
    this.shState = !this.shState;
    rVal = this.shState;
    if(this.shState) {
      this.shStateText = 'ON';
    } else {
      this.shStateText = 'OFF';
    }
    this.onChangeDetected(rVal);
  }

}