import {Component, Input} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { shDevice } from 'src/app/interfaces/device.interface';
import { DragDropItemComponent } from '../../dragdrop.item';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
})
export class SwitchComponent extends DragDropItemComponent {
  @Input()
  override device: shDevice | undefined;

  override ngOnInit(): void {
    super.ngOnInit();

  }

  onSlideToggleChange(event: MatSlideToggleChange) {
    if (this.device) {
      console.log(this.device?.deviceNameFriendly + ' toggled!');
      console.log('New state:', event.checked);
    }
  }
}
