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
  shStateText: string = 'Off';

  override ngOnInit(): void {
    super.ngOnInit();
  }

  changeDetected(event: any) {
    this.onChangeDetect(event);
  }

  onChangeDetect(event: any) {
    let rVal: any;
    try {
        rVal = (<HTMLInputElement> document.getElementById(this.componentID)).value;
    } catch {
        console.log('error');
        rVal = '';
    }

    this.onChangeDetected(rVal);
  }

}