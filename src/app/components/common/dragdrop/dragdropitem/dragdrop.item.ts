import {Component, EventEmitter, Input} from '@angular/core';
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
  device: shDevice | undefined;
  
  updateSwitchStateEmitter: EventEmitter<any> = new EventEmitter();

  isSwitch: boolean = false;
  isSensor: boolean = false;
  deviceName: string = '';
  deviceType: string = '';

  override ngOnInit() {
    super.ngOnInit();

    if(this.device) {
      this.deviceName = this.device.deviceName;
      this.deviceType = this.device.deviceType;
    }
    if (this.deviceType == TYPE_SENSOR) {
      this.isSensor = true;
    } else {
      this.isSwitch = true;
    }
    this.addSubscription(this.updateSwitchStateEmitter.subscribe(resp => {
      /* 
      * Once device service is created we will pass deviceID and state to send
      * to the backend
      */
      console.log(resp);
    }));
  }

  deleteDevice() {
    if (this.device) {
      this.deviceService.deleteDevice(this.device).subscribe();
    }
  }
}
