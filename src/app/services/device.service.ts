import { DEVICE_ENDPOINT, ROOT_URL, USER_ENDPOINT } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shDevice } from '../interfaces/device.interface';
import { GridsterItem } from 'angular-gridster2';

@Injectable()
export class DeviceService {

  // Device Emitters
  @Output() newDeviceEmitter: EventEmitter<any> = new EventEmitter();

  private devices: shDevice[] = [];

  constructor(public http: HttpClient) {}

  public clearDevices() {
    this.devices = [];
  }

  public getDevices(): shDevice[] {
    return this.devices;
  }

  public addDevice(device: shDevice) {
    this.devices.push(device);
  }

  public deleteDevice(device: shDevice): Observable<any> {
    this.devices.splice(this.devices.indexOf(device), 1);
    return this.http.post<any>(ROOT_URL + DEVICE_ENDPOINT + "delete", device);
  }

  public registerDevice(device: shDevice): Observable<any> {
    return this.http.post(ROOT_URL + DEVICE_ENDPOINT + "register", device);
  }

  public updateDevicePosition(device: shDevice): Observable<any> {
    return this.http.post(ROOT_URL + DEVICE_ENDPOINT + "update/position", device);
  }

}