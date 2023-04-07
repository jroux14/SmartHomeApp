import { Component, EventEmitter, Input } from '@angular/core';
import { shDevice } from 'src/app/interfaces/device.interface';
import { CommonComponent } from '../../common/common.component';

@Component({
  selector: 'sh-newdevice',
  templateUrl: 'newdevice-popup.component.html',
  styleUrls: ['newdevice-popup.component.css'],
})
export class NewDevicePopupComponent extends CommonComponent {
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
        this.deviceType = resp.value;
      }));
      this.addSubscription(this.dataService.confirmNewDeviceEmitter.subscribe(resp => {
        /* 
        *  This logic will be replaced once backend is working with Mongo...
        *  We will store this data and pull it into dragdrop container, then we will
        *  select which dragdrop "cell" we want to place it in and create the device
        *  with that position and a size of 1x1
        */
        let device = new shDevice(this.deviceType, this.deviceName, 'test', 1, 1, 0, 0);
        this.dataService.forwardNewDeviceEmitter.emit(device);
      }));
  }

}