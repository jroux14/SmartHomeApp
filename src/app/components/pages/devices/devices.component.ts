import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { shDevice } from 'src/app/interfaces/device.interface';
import { CommonComponent } from '../../common/common/common.component';
import { LoginPopupComponent } from '../../common/popup/login-popup/login-popup.component';
import { DevicePagePopup } from '../../common/popup/devicepage-popup/devicepage.popup';
import {Observable, switchMap} from "rxjs";
import { shRoom } from "../../../interfaces/room.interface";
import {NAME_OUTLET, NAME_SENSOR, TYPE_OUTLET, TYPE_SENSOR} from "../../../constants/constants.smarthome";

@Component({
  selector: 'app-home',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent extends CommonComponent{
  @ViewChild("sideNav") sideNav: MatSidenav | undefined;

  TYPE_ROOM: string = "ROOM_PANEL";
  TYPE_DEVICE: string = "DEVICE_TYPE_PANEL"

  deviceTypes: any[] = [
    { name: NAME_OUTLET + 's', type: TYPE_OUTLET},
    { name: NAME_SENSOR + 's', type: TYPE_SENSOR},
  ]
  existingDeviceTypes: any[] = [];

  newDevice: shDevice | undefined;
  newRoom: shRoom | undefined;

  loginDialog: MatDialogRef<LoginPopupComponent> | null = null;

  override ngOnInit() {
    super.ngOnInit();

    this.existingDeviceTypes = this.deviceTypes.filter(type =>
      this.deviceService.getDevicesByType(type.type).length > 0
    );

    this.addSubscription(this.deviceService.newDeviceEmitter.pipe(
      switchMap(res => {
        this.newDevice = res;
        return this.deviceService.registerDevice(res)
      })
    ).subscribe((res) => {
      if (res && res.success && res.id && this.newDevice) {
        this.popupService.closePopup();
        this.newDevice.id = res.id;
        this.deviceService.addDevice(this.newDevice);
      } else {
        if (res.error) {
          let ref = this.openSnackBar(res.error, "Try Again");
          this.popupService.resolvePopupSnackBar(ref, DevicePagePopup, { panelClass: 'baseDialog', disableClose: false });
        } else {
          let ref = this.openSnackBar("Unknown Error", "Try Again");
          this.popupService.resolvePopupSnackBar(ref, DevicePagePopup, { panelClass: 'baseDialog', disableClose: false });
        }
      }
    }));

    this.addSubscription(this.authService.newRoomEmitter.pipe(
      switchMap(res => this.authService.createRoom(res))
    ).subscribe((res) => {
      if (res && res.success && res.room) {
        this.popupService.closePopup();
        this.newRoom = res.room;
        if (this.newRoom) {
          this.authService.addRoom(this.newRoom);
        }
      } else {
        if (res.error) {
          let ref = this.openSnackBar(res.error, "Try Again");
          this.popupService.resolvePopupSnackBar(ref, DevicePagePopup, { panelClass: 'baseDialog', disableClose: false });
        } else {
          let ref = this.openSnackBar("Unknown Error", "Try Again");
          this.popupService.resolvePopupSnackBar(ref, DevicePagePopup, { panelClass: 'baseDialog', disableClose: false });
        }
      }
    }));
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.sideNav) {
      this.dataService.setSideNav(this.sideNav);
    }
  }

  getDevicesByPanelType(type: string, typeValue: string): shDevice[] {
    if (type == this.TYPE_DEVICE) {
      return this.deviceService.getDevicesByType(typeValue);
    } else if (type == this.TYPE_ROOM) {
      return this.deviceService.getDevicesByRoomId(typeValue);
    } else {
      return this.deviceService.getDevices();
    }
  }

  createNewDeviceOrRoom() {
    this.popupService.openPopup(DevicePagePopup, {
      panelClass: 'baseDialog'
    });
  }

  trackByDeviceId(index: number, device: shDevice): string | undefined {
    return device.id;
  }
}
