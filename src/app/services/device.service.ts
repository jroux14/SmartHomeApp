import {
  DEVICE_ENDPOINT,
  NAME_OUTLET,
  NAME_SENSOR,
  ROOT_URL,
  TYPE_OUTLET,
  TYPE_SENSOR
} from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { interval, map, Observable, of, switchMap } from 'rxjs';
import { shDevice } from '../interfaces/device.interface';
import {shDeviceReading} from "../interfaces/devicereading.interface";

@Injectable()
export class DeviceService {

  // Device Emitters
  @Output() newDeviceEmitter: EventEmitter<any> = new EventEmitter();

  private deviceTypes: any[] = [
    {display: NAME_SENSOR, value: TYPE_SENSOR},
    {display: NAME_OUTLET, value: TYPE_OUTLET}
  ]
  private devices: shDevice[] = [];

  public testSwitchCount: number = 0;
  public testSensorCount: number = 0;

  constructor(public http: HttpClient) {
    interval(1000)
      .pipe(
        switchMap(() => {
          if (this.devices.length != 0) {
            return this.getAllDeviceData();
          } else {
            return of(null);
          }
        })
      ).subscribe((res) => {
        if (res && res.success && res.data) {
          this.devices = this.devices.map(device => {
            const deviceId = device.id;
            const updatedData = deviceId ? res.data[deviceId] : null;

            if (!updatedData) return device;

            const currentDataStr = JSON.stringify(device.data);
            const newDataStr = JSON.stringify(updatedData);

            if (currentDataStr !== newDataStr) {
              return { ...device, data: updatedData }; // only overwrite if different
            }

            return device; // unchanged
          });
        }
      });
  }

  public getDeviceTypes(): any[] {
    return this.deviceTypes;
  }

  public getTestSwitchCount(): number {
    return this.testSwitchCount;
  }

  public getTestSensorCount(): number {
    return this.testSensorCount;
  }

  public addTestSwitch() {
    this.testSwitchCount += 1;
  }

  public addTestSensor() {
    this.testSensorCount += 1;
  }

  public clearDevices() {
    this.devices = [];
  }

  public getDevice(device: shDevice): shDevice | undefined {
    return this.devices.find((device) => device);
  }

  public getDevices(): shDevice[] {
    return this.devices;
  }

  public getDevicesByRoomId(roomId: string): shDevice[] {
    return this.devices.filter(device => device.roomId === roomId);
  }

  public getDevicesByType(type: string): shDevice[] {
    return this.devices.filter(device => device.deviceType === type);
  }

  public addDevice(device: shDevice) {
    if (!this.devices.includes(device)) {
      this.devices.push(device);
    }
  }

  public updateDeviceData(device: shDevice): Observable<shDevice> {
    if (!device.deviceName || !this.devices.includes(device)) {
      return of(device); // Return current state if nothing to do
    }

    if (device.id) {
      return this.getDeviceDataById(device.id).pipe(
        map(resp => {
          if (resp.data && resp.success) {
            const updatedDevice = { ...device, data: resp.data }; // immutable update
            const index = this.devices.findIndex(d => d.deviceName === device.deviceName);
            if (index !== -1) {
              this.devices[index] = updatedDevice;
            }
            return updatedDevice;
          }
          return device; // fallback to original if fetch fails
        })
      );
    } else {
      return of(device);
    }
  }

  public getDeviceDataById(deviceId: String) : Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/data/" + deviceId, { headers });
  }

  public getAllDeviceData() : Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/data", { headers });
  }

  public getSensorReadingsByDeviceId(deviceId: string, start: string, end: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/sensor/data/" + deviceId + "?start=" + start + "&end=" + end, { headers });
  }

  public getHourlySensorReadingsByDeviceId(deviceId: string, sensorName: string, start: string, end: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/" + sensorName + "/data/" + deviceId + "/hourly", { headers: headers, params: params });
  }

  public getDailySensorReadingsByDeviceId(deviceId: string, sensorName: string, start: string, end: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/" + sensorName + "/data/" + deviceId + "/daily", { headers: headers, params: params });
  }

  public getMonthlySensorReadingsByDeviceId(deviceId: string, sensorName: string, start: string, end: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/" + sensorName + "/data/" + deviceId + "/monthly", { headers: headers, params: params });
  }

  public getYearlySensorReadingsByDeviceId(deviceId: string, sensorName: string, startYear: number, endYear: number): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams()
      .set('start', startYear)
      .set('end', endYear);
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/" + sensorName + "/data/" + deviceId + "/yearly", { headers: headers, params: params });
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
}
