import { Component, Input } from '@angular/core';
import { CommonComponent } from '../../components/common/common/common.component';

@Component({
  selector: 'sh-text',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent extends CommonComponent {
  @Input()
  tLabel: String = '';
  @Input()
  componentID: string = '';
  @Input()
  defaultText: String = '';

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
    this.dataService.changeDetected.emit(data);
  }

}