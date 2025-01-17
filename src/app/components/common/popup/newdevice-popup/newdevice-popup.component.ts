import { Component, EventEmitter, Input } from '@angular/core';
import { shDevice } from 'src/app/interfaces/device.interface';
import { CommonComponent } from '../../common/common.component';
import { v4 as uuidv4 } from 'uuid';
import { TYPE_SENSOR, TYPE_SWITCH } from 'src/app/constants/constants.smarthome';

@Component({
  selector: 'sh-newdevice',
  templateUrl: 'newdevice-popup.component.html',
  styleUrls: ['newdevice-popup.component.css'],
})
export class NewDevicePopupComponent extends CommonComponent {
  deviceTypes = [
    {
      name: TYPE_SWITCH,
      displayName: "Switch"
    },
    {
      name: TYPE_SENSOR,
      displayName: "Sensor"
    }
  ]
  deviceName: string = '';
  deviceType: any | undefined;

  override ngOnInit(): void {
      super.ngOnInit();
  }

  confirmNewDevice() {
    let snackBarMsg: any | null = null;

    if(this.deviceName != '' && this.deviceType) {
      if(this.authService.getCurrentUser()) {
        let newUID: string = uuidv4();
        let device = new shDevice(this.authService.getCurrentUserId(), this.deviceType, this.deviceName, newUID, 1, 1, 0, 0);
        this.deviceService.newDeviceEmitter.emit(device);
      } else {
        snackBarMsg = {msg: 'Must be logged in', action: 'Try Again'};
      }

      if (snackBarMsg) {
        let ref = this.openSnackBar(snackBarMsg.msg, snackBarMsg.action);
        this.popupService.resolvePopupSnackBar(ref, NewDevicePopupComponent, { panelClass: "baseDialog", disableClose: false })
      }
    } else {
      snackBarMsg = {msg: 'Fill in all fields', action: 'Try Again'};
    }

    if (snackBarMsg) {
      let ref = this.openSnackBar(snackBarMsg.msg, snackBarMsg.action);
      this.popupService.resolvePopupSnackBar(ref, NewDevicePopupComponent, { panelClass: "baseDialog", disableClose: false })
    }
  }
}