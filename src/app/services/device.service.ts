import { DEVICE_ENDPOINT, ROOT_URL } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { shDevice } from '../interfaces/device.interface';

@Injectable()
export class DeviceService {

  // Device Emitters
  @Output() newDeviceEmitter: EventEmitter<any> = new EventEmitter();

  private devices: shDevice[] = [];

  constructor(public http: HttpClient) {}

  public clearDevices() {
    this.devices = [];
  }

  public getDevice(device: shDevice): shDevice | undefined {
    return this.devices.find((device) => device);
  }

  public getDevices(): shDevice[] {
    return this.devices;
  }

  public addDevice(device: shDevice) {
    if (!this.devices.includes(device)) {
      this.devices.push(device);
    }
  }

  public getDeviceData(device: shDevice) : Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/data/" + device.deviceName, { headers });
  }

  public testSub() : Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let messageData = {
      topic: "d-00001/control/toggle",
    }
    return this.http.post<any>(ROOT_URL + DEVICE_ENDPOINT + "add/topic", messageData, { headers });
  }

  public testPub() : Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let messageData = {
      topic: "d-00001/control/toggle",
      payload: ""
    }
    return this.http.post<any>(ROOT_URL + DEVICE_ENDPOINT + "send/message", messageData, { headers });
  }

  public toggleSwitch(deviceName: string) : Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let messageData = {
      topic: deviceName + "/control/toggle",
      payload: ""
    }
    return this.http.post<any>(ROOT_URL + DEVICE_ENDPOINT + "send/message", messageData, { headers });
  }

  public getAvailableDevices() {
    return this.http.get<any>(ROOT_URL + DEVICE_ENDPOINT + "get/available");
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
