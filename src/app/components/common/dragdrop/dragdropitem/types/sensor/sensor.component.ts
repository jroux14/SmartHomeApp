import {Component, Input} from '@angular/core';
import { shDevice } from 'src/app/interfaces/device.interface';
import { DragDropItemComponent } from '../../dragdrop.item';

@Component({
  selector: 'sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css'],
})
export class SensorComponent extends DragDropItemComponent {
  @Input()
  override device: shDevice | undefined;
  
  deviceID: string = "";

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.device && this.device.id) {
      this.deviceID = this.device.id;
    }
  }
}
