import { DEVICE_ENDPOINT, ROOT_URL, USER_ENDPOINT } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { shDevice } from '../interfaces/device.interface';
import { GridsterItem } from 'angular-gridster2';

@Injectable()
export class DeviceService {

  // Device Emitters
  @Output() addDeviceEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateDeviceEmitter: EventEmitter<any> = new EventEmitter();

  @Output() deleteDeviceEmitter: EventEmitter<any> = new EventEmitter();
  @Output() userDeviceEmitter: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient) {}

  public test(): Observable<any> {
    return this.http.get<any>(ROOT_URL+"test");
  }

  public getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(ROOT_URL + USER_ENDPOINT + "getUser");
  }

  public registerDevice(device: shDevice): Observable<any> {
    return this.http.post(ROOT_URL + DEVICE_ENDPOINT + "register", device);
  }

  public updateDeviceGridItem(deviceId: String, item: GridsterItem): Observable<any> {
    let body = {
        deviceId: deviceId,
        item: item
    };
    return this.http.post(ROOT_URL + DEVICE_ENDPOINT + "updateItem", body);
  }

}