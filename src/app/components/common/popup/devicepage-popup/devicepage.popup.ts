import { Component } from '@angular/core';
import { shDevice } from 'src/app/interfaces/device.interface';
import { CommonComponent } from '../../common/common.component';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  DISPLAY_DEVICE_POPUP,
  DISPLAY_ROOM_POPUP,
  TYPE_OUTLET,
  TYPE_SENSOR, VALUE_DEVICE_POPUP,
  VALUE_ROOM_POPUP
} from "../../../../constants/constants.smarthome";

@Component({
  selector: 'devicepage-popup',
  templateUrl: 'devicepage.popup.html',
  styleUrls: ['devicepage.popup.css'],
})
export class DevicePagePopup extends CommonComponent {

  panelTypes: any = [
    { display: DISPLAY_ROOM_POPUP, value: VALUE_ROOM_POPUP },
    { display: DISPLAY_DEVICE_POPUP, value: VALUE_DEVICE_POPUP }
  ];
  panelType: string = '';

  roomNameControl = new FormControl('');

  device: shDevice | undefined;
  devSwitch: shDevice = new shDevice('', TYPE_OUTLET, 'dev-outlet', '', '', undefined);
  devSensor: shDevice = new shDevice('', TYPE_SENSOR, 'dev-sensor', '', '', undefined);

  devices: shDevice[] = [];
  deviceSelection: shDevice[] | null = null;

  selectDeviceGroup: FormGroup = new FormGroup({});
  selectionListControl = new FormControl(this.deviceSelection, Validators.required);

  deviceNameGroup: FormGroup = new FormGroup({});
  deviceNameControl = new FormControl('', Validators.required);

  deviceAssignmentGroup: FormGroup = new FormGroup({});
  deviceAssignmentControl = new FormControl('', Validators.required);

  panelTypeControl: FormControl<string | null> = new FormControl(null);

  override ngOnInit(): void {
      super.ngOnInit();

      this.addSubscription(this.deviceService.getAvailableDevices().subscribe(resp => {
        this.devices = resp.devices;
        this.devices.push(this.devSwitch);
        this.devices.push(this.devSensor);
      }));
  }

  addRoom() {
    let roomName: string | null = this.roomNameControl.value;
    if (roomName && roomName != '') {
      this.authService.newRoomEmitter.emit(roomName);
    }
  }

  selectPanelType(): void {
    if (this.panelTypeControl.value) {
      this.panelType = this.panelTypeControl.value[0];
    }
  }

  selectDevice(device: shDevice | null): void {
    if (device) {
      this.device = device;
    }
  }

  confirmNewDevice() {
    let snackBarMsg: any | null = null;
    let deviceNameFriendly = this.deviceNameControl.value;
    let roomAssignment: string | null = this.deviceAssignmentControl.value;

    if(deviceNameFriendly && deviceNameFriendly != '' && roomAssignment && roomAssignment != '' && this.device) {
      if(this.authService.getCurrentUser()) {
        let newDevice: shDevice | null = null;
        if(this.device.deviceName == this.devSwitch.deviceName) {
          this.device.deviceName = this.device.deviceName + '-' + this.deviceService.getTestSwitchCount();
          this.deviceService.addTestSwitch();
          newDevice = new shDevice(this.authService.getCurrentUserId(), this.device.deviceType, this.device.deviceName, deviceNameFriendly, roomAssignment, this.device.data);
        } else if (this.device.deviceName == this.devSensor.deviceName) {
          this.device.deviceName = this.device.deviceName + '-' + this.deviceService.getTestSensorCount();
          this.deviceService.addTestSensor();
          newDevice = new shDevice(this.authService.getCurrentUserId(), this.device.deviceType, this.device.deviceName, deviceNameFriendly, roomAssignment, this.device.data);
        } else {
          newDevice = new shDevice(this.authService.getCurrentUserId(), this.device.deviceType, this.device.deviceName, deviceNameFriendly, roomAssignment, this.device.data);
        }
        this.deviceService.newDeviceEmitter.emit(newDevice);
      } else {
        snackBarMsg = {msg: 'Must be logged in', action: 'Try Again'};
      }

      if (snackBarMsg) {
        let ref = this.openSnackBar(snackBarMsg.msg, snackBarMsg.action);
        this.popupService.resolvePopupSnackBar(ref, DevicePagePopup, { panelClass: "baseDialog", disableClose: false })
      }
    } else {
      snackBarMsg = {msg: 'Fill in all fields', action: 'Try Again'};
    }

    if (snackBarMsg) {
      let ref = this.openSnackBar(snackBarMsg.msg, snackBarMsg.action);
      this.popupService.resolvePopupSnackBar(ref, DevicePagePopup, { panelClass: "baseDialog", disableClose: false })
    }
  }
}
