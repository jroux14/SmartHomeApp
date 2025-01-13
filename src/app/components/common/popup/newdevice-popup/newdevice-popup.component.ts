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
  loggedIn: boolean = this.authService.currentUser ? true : false;
  deviceName: string = '';
  deviceType: any | undefined;

  updateDeviceNameEmitter: EventEmitter<any> = new EventEmitter();
  updateDeviceTypeEmitter: EventEmitter<any> = new EventEmitter();
  confirmNewDeviceEmitter: EventEmitter<any> = new EventEmitter();

  override ngOnInit(): void {
      super.ngOnInit();
      this.addSubscription(this.updateDeviceNameEmitter.subscribe(resp => {
        this.deviceName = resp.value;
      }));
      this.addSubscription(this.updateDeviceTypeEmitter.subscribe(resp => {
        let newType: any = this.getDeviceType(resp);
        if(newType) {
          this.deviceType = newType;
        }
      }));
      // this.addSubscription(this.confirmNewDeviceEmitter.subscribe(resp => {
      //   /* 
      //   *  This logic will be replaced once backend is working with Mongo...
      //   *  We will store this data and pull it into dragdrop container, then we will
      //   *  select which dragdrop "cell" we want to place it in and create the device
      //   *  with that position and a size of 1x1
      //   */
      //   if(this.deviceName != '' && this.deviceType != '') {
      //     if(this.authService.currentUser) {
      //       let newUID: string = uuidv4();
      //       let device = new shDevice(this.authService.currentUser.userID, this.deviceType, this.deviceName, newUID, 1, 1, 0, 0);
      //       this.fillAllWarning = false;
      //       this.logInWarning = false;
      //       this.dataService.closeDevicePopupEmitter.emit();
      //       this.dataService.forwardNewDeviceEmitter.emit(device);
      //     } else {
      //       this.logInWarning = true;
      //     }
      //   } else {
      //     this.fillAllWarning = true;
      //   }
      // }));
      this.addSubscription(this.dataService.userChangeEmitter.subscribe(resp => {
        this.loggedIn = this.authService.currentUser ? true : false;
      }));
  }

  confirmNewDevice() {
    let snackBarMsg: any | null = null;

    if(this.deviceName != '' && this.deviceType) {
      if(this.authService.currentUser) {
        let newUID: string = uuidv4();
        let device = new shDevice(this.authService.currentUser.userID, this.deviceType, this.deviceName, newUID, 1, 1, 0, 0);
        this.dataService.forwardNewDeviceEmitter.emit(device);
        this.popupService.closePopup();
      } else {
        snackBarMsg = {msg: 'Must be logged in', action: 'Try Again'};
      }
    } else {
      snackBarMsg = {msg: 'Fill in all fields', action: 'Try Again'};
    }

    if (snackBarMsg) {
      this.popupService.closePopup();
      let ref = this.openSnackBar(snackBarMsg.msg, snackBarMsg.action);
      ref.onAction().subscribe(() => {
        this.popupService.openPopup(NewDevicePopupComponent, {
          panelClass: 'baseDialog'
        });    
      });
    }
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