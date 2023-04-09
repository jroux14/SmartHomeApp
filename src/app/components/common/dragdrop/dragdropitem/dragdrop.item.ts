import {Component, Input, OnInit} from '@angular/core';
import {GridsterComponent, GridsterItemComponent} from 'angular-gridster2';
import { CommonComponent } from '../../common/common.component';
import { shDevice } from 'src/app/interfaces/device.interface';
import { TYPE_SENSOR, TYPE_SWITCH } from 'src/app/constants/constants.smarthome';

@Component({
  selector: 'dragdrop-item',
  templateUrl: './dragdrop.item.html',
  styleUrls: ['./dragdrop.item.css'],
})
export class DragDropItemComponent extends CommonComponent{
  @Input()
  thisDevice: shDevice | undefined;

  isSwitch: boolean = false;
  isSensor: boolean = false;
  deviceName: string = '';
  deviceType: string = '';

  override ngOnInit() {
    super.ngOnInit();
    if(this.thisDevice) {
      this.deviceName = this.thisDevice.deviceName;
      this.deviceType = this.thisDevice.deviceType.name;
    }
    this.getDeviceType();
  }

  getDeviceType() {
    if(this.thisDevice) {
      if(this.deviceType == TYPE_SENSOR) {
        this.isSensor = true;
      }
      if(this.deviceType == TYPE_SWITCH) {
        this.isSwitch = true;
      }
    }
  }

}
