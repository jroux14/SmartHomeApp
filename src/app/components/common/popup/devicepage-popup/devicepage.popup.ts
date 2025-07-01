import { Component } from '@angular/core';
import { shDevice } from 'src/app/interfaces/device.interface';
import { CommonComponent } from '../../common/common.component';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'devicepage-popup',
  templateUrl: 'devicepage.popup.html',
  styleUrls: ['devicepage.popup.css'],
})
export class DevicePagePopup extends CommonComponent {

  panelTypes: any = [
    { display: "Add Room", value: "ROOM_PANEL" },
    { display: "Add Device", value: "DEVICE_PANEL" }
  ];
  panelType: string = '';

  roomNameControl = new FormControl('');

  device: shDevice | undefined;

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
      }));
  }

  addRoom() {
    let roomName: string | null = this.roomNameControl.value;
    if (roomName && roomName != '') {
      this.authService.newRoomEmitter.emit(roomName);
      // this.addSubscription(this.authService.createRoom(roomName).subscribe(resp => {
      //   console.log(resp);
      // }))
    }
  }

  selectPanelType(): void {
    if (this.panelTypeControl.value) {
      this.panelType = this.panelTypeControl.value[0];
      console.log(this.panelType);
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
        let newDevice = new shDevice(this.authService.getCurrentUserId(), this.device.deviceType, this.device.deviceName, deviceNameFriendly, roomAssignment, this.device.item, this.device.data);
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
