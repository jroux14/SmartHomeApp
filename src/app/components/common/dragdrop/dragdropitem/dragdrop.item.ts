import {Component, Input} from '@angular/core';
import { CommonComponent } from '../../common/common.component';
import { shDevice } from 'src/app/interfaces/device.interface';
import { TYPE_SENSOR, TYPE_OUTLET } from 'src/app/constants/constants.smarthome';

@Component({
  selector: 'dragdrop-item',
  templateUrl: './dragdrop.item.html',
  styleUrls: ['./dragdrop.item.css'],
})
export class DragDropItemComponent extends CommonComponent{
  @Input()
  device: shDevice | undefined;

  typeList = {
    outlet: TYPE_OUTLET,
    sensor: TYPE_SENSOR
  }
  deviceType: string = '';

  override ngOnInit() {
    super.ngOnInit();

    if(this.device) {
      this.deviceType = this.device.deviceType;
    }
  }

  deleteDevice() {
    if (this.device) {
      this.deviceService.deleteDevice(this.device).subscribe();
    }
  }
}
