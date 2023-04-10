import { Component, EventEmitter, Input } from '@angular/core';
import { shDevice } from 'src/app/interfaces/device.interface';
import { CommonComponent } from '../../common/common.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'sh-newdevice',
  templateUrl: 'newdevice-popup.component.html',
  styleUrls: ['newdevice-popup.component.css'],
})
export class NewDevicePopupComponent extends CommonComponent {
  deviceTypes = [
    {
      name: "TYPE_SWITCH",
      displayName: "Switch"
    },
    {
      name: "TYPE_SENSOR",
      displayName: "Sensor"
    }
  ]
  deviceName: string = '';
  deviceType: string = '';
  updateDeviceNameEmitter: EventEmitter<any> = this.dataService.updateDeviceNameEmitter;
  updateDeviceTypeEmitter: EventEmitter<any> = this.dataService.updateDeviceTypeEmitter;
  confirmNewDeviceEmitter: EventEmitter<any> = this.dataService.confirmNewDeviceEmitter;
  override ngOnInit(): void {
      super.ngOnInit();
      this.addSubscription(this.dataService.updateDeviceNameEmitter.subscribe(resp => {
        this.deviceName = resp.value;
      }));
      this.addSubscription(this.dataService.updateDeviceTypeEmitter.subscribe(resp => {
        let newType: any = this.getDeviceType(resp);
        if(newType) {
          this.deviceType = newType;
        }
      }));
      this.addSubscription(this.dataService.confirmNewDeviceEmitter.subscribe(resp => {
        /* 
        *  This logic will be replaced once backend is working with Mongo...
        *  We will store this data and pull it into dragdrop container, then we will
        *  select which dragdrop "cell" we want to place it in and create the device
        *  with that position and a size of 1x1
        */
        let newUID: string = uuidv4();
        let device = new shDevice(this.deviceType, this.deviceName, newUID, 1, 1, 0, 0);
        this.dataService.forwardNewDeviceEmitter.emit(device);
      }));
  }

  getDropdownOptions() : string[] {
    let rVal: string[] = [];
    this.deviceTypes.forEach((type) => {
      rVal.push(type.displayName);
    });
    return rVal;
  }

  getDeviceType(typeDisplayName: string) {
    let foundMatch: any;
    this.deviceTypes.forEach((type) => {
      if(type.displayName == typeDisplayName) {
        foundMatch = type;
      }
    });
    if(foundMatch) {
      return foundMatch;
    } else {
      return;
    }
  }

}