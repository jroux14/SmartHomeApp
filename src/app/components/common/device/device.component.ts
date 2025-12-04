import {Component, Input} from '@angular/core';
import { CommonComponent } from '../common/common.component';
import { shDevice } from 'src/app/interfaces/device.interface';
import { TYPE_SENSOR, TYPE_OUTLET } from 'src/app/constants/constants.smarthome';
import { of, switchMap } from "rxjs";
import {ConfirmationSnackbarComponent} from "../confirmationsnackbar/confirmationsnackbar.component";
import {DeviceStatsPopup} from "../popup/devicestats-popup/devicestats.popup";

@Component({
  selector: 'sh-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
})
export class DeviceComponent extends CommonComponent{
  @Input()
  device: shDevice | undefined;

  typeList = {
    outlet: TYPE_OUTLET,
    sensor: TYPE_SENSOR
  }
  deviceType: string = '';

  editModeActive: boolean = false;

  override ngOnInit() {
    super.ngOnInit();

    if(this.device) {
      this.deviceType = this.device.deviceType;
    }

    this.addSubscription(this.dataService.editModeEmitter.subscribe(resp => {
      this.editModeActive = resp;
    }));
  }

  showDeviceStats() {
    let popupData = {
      "device": this.device
    }
    this.popupService.openPopup(DeviceStatsPopup, {
      height: '75vh',
      panelClass: 'sensorReadingsDialog',
      data: popupData
    });
  }

  deleteDevice() {
    if (this.device) {
       this.addSubscription(this.bottomSheet.open(ConfirmationSnackbarComponent, {
         data: {
           message: `Are you sure you want to delete device ${this.device.deviceNameFriendly}?`,
           actions: [
             { label: 'Confirm', value: "confirm" },
             { label: 'Cancel', value: "cancel" },
           ]
         }
       }).afterDismissed()
         .pipe(
           switchMap((result) => {
             if (result == "confirm" && this.device) {
               return this.deviceService.deleteDevice(this.device);
             } else {
               return of(null);
             }
           })
         ).subscribe());
    }
  }
}
