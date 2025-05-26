import { Component } from '@angular/core';
import { shDevice } from 'src/app/interfaces/device.interface';
import { CommonComponent } from '../../common/common.component';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'sh-newdevice',
  templateUrl: 'newpanel-popup.component.html',
  styleUrls: ['newpanel-popup.component.css'],
})
export class NewPanelPopupComponent extends CommonComponent {

  panelTypes: any = [
    { display: "Statistics Panel", value: "STATS_PANEL" },
    { display: "New Device", value: "DEVICE_PANEL" }
  ];
  panelType: string = '';

  panelName: string = '';
  deviceForStats: string = '';
  statType: string = '';

  device: shDevice | undefined;

  devices: shDevice[] = [];
  deviceSelection: shDevice[] | null = null;

  selectDeviceGroup: FormGroup = new FormGroup({});
  selectionListControl = new FormControl(this.deviceSelection, Validators.required);

  deviceNameGroup: FormGroup = new FormGroup({});
  deviceNameControl = new FormControl('', Validators.required);

  panelTypeControl: FormControl<string | null> = new FormControl(null);

  override ngOnInit(): void {
      super.ngOnInit();

      this.getAvailableDevices();
  }

  test() {
    console.log(this.device);
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

  getAvailableDevices() {
    this.deviceService.getAvailableDevices().subscribe(resp => {
      this.devices = resp.devices;
    })
  }

  confirmNewDevice() {
    let snackBarMsg: any | null = null;
    let deviceNameFriendly = this.deviceNameControl.value;

    if(deviceNameFriendly && deviceNameFriendly != '' && this.device) {
      if(this.authService.getCurrentUser()) {
        let namedDevice = new shDevice(this.authService.getCurrentUserId(), this.device.deviceType, this.device.deviceName, deviceNameFriendly, this.device.item, this.device.data);
        this.deviceService.newDeviceEmitter.emit(namedDevice);
      } else {
        snackBarMsg = {msg: 'Must be logged in', action: 'Try Again'};
      }

      if (snackBarMsg) {
        let ref = this.openSnackBar(snackBarMsg.msg, snackBarMsg.action);
        this.popupService.resolvePopupSnackBar(ref, NewPanelPopupComponent, { panelClass: "baseDialog", disableClose: false })
      }
    } else {
      snackBarMsg = {msg: 'Fill in all fields', action: 'Try Again'};
    }

    if (snackBarMsg) {
      let ref = this.openSnackBar(snackBarMsg.msg, snackBarMsg.action);
      this.popupService.resolvePopupSnackBar(ref, NewPanelPopupComponent, { panelClass: "baseDialog", disableClose: false })
    }
  }
}
