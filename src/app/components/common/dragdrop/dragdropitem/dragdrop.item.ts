import {Component, Input} from '@angular/core';
import { CommonComponent } from '../../common/common.component';
import { shDevice } from 'src/app/interfaces/device.interface';
import { TYPE_SENSOR, TYPE_OUTLET } from 'src/app/constants/constants.smarthome';
import {interval, of, switchMap} from "rxjs";

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

    interval(1000)
      .pipe(
        switchMap(() => {
          if (this.device) {
            return this.deviceService.getDeviceData(this.device);
          } else {
            return of(null);
          }
        })
      ).subscribe((token) => {
      //do whatever you want to do with token
      if (token.success) {
        if (this.device && token.data) {
          this.device.data = token.data;
        }
      }
    });
  }

  deleteDevice() {
    if (this.device) {
      this.deviceService.deleteDevice(this.device).subscribe();
    }
  }
}
