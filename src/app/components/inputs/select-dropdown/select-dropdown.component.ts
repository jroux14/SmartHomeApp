import { Component, Input } from '@angular/core';
import { CommonInputComponent } from '../common-input/common-input.component';

@Component({
  selector: 'sh-select',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.css']
})
export class SelectDropDownInputComponent extends CommonInputComponent {
  @Input()
  tLabel: string = '';
  @Input()
  componentID: string = '';
  @Input()
  shPlaceholder: string = '';
  @Input()
  shOptions: string[] = [];
  @Input()
  shDisabled: boolean = false;
  @Input()
  shValue: string = '';

  override ngOnInit(): void {
    super.ngOnInit();
  }

  onChangeDetect(event: any) {
    let rVal: any;
    try {
        rVal = (<HTMLInputElement> document.getElementById(this.componentID)).value;
    } catch {
        console.log('error');
        rVal = '';
    }
    this.shValue = rVal;

    this.onChangeDetected(rVal);
  }

}