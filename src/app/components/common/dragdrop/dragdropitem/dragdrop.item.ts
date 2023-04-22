import {Component, EventEmitter, Input, OnInit} from '@angular/core';
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
  deleteDeviceEmitter: EventEmitter<any> = this.dataService.deleteDeviceEmitter;
  updateSwitchStateEmitter: EventEmitter<any> = new EventEmitter();

  isSwitch: boolean = false;
  isSensor: boolean = false;
  deviceName: string = '';
  deviceType: string = '';
  componentID: string = '';
  emitterData: any;

  override ngOnInit() {
    super.ngOnInit();
    if(this.thisDevice) {
      this.deviceName = this.thisDevice.deviceName;
      this.deviceType = this.thisDevice.deviceType.name;
      this.componentID = this.thisDevice.deviceID;
      this.emitterData = {
        device: this.thisDevice,
        event: ''
      }
    }
    this.getDeviceType();
    this.addSubscription(this.updateSwitchStateEmitter.subscribe(resp => {
      /* 
      * Once device service is created we will pass deviceID and state to send
      * to the backend
      */
      console.log(this.thisDevice);
      console.log(resp);
    }));
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
