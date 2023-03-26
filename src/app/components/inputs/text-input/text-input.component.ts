import { Component, Input } from '@angular/core';
import { CommonInputComponent } from '../common-input/common-input.component';

@Component({
  selector: 'sh-text',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent extends CommonInputComponent {
  @Input()
  tLabel: String = '';
  @Input()
  componentID: string = '';
  @Input()
  defaultText: String = '';
  @Input()
  isPwd: boolean = false;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  onChangeDetect(event: any) {
    let inputValue = <HTMLInputElement> document.getElementById(this.componentID);
    let data: {[key: string]: any} = {
        id: this.componentID,
        value: inputValue.value,
        event: event
    }
    this.onChangeDetected(data);
  }

}