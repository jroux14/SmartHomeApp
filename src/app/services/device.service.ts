import { DEVICE_ENDPOINT, ROOT_URL } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval, map, Observable, of, switchMap } from 'rxjs';
import { shDevice } from '../interfaces/device.interface';

@Injectable()
export class DeviceService {

  // Device Emitters
  @Output() newDeviceEmitter: EventEmitter<any> = new EventEmitter();

  private devices: shDevice[] = [];

  constructor(public http: HttpClient) {
    interval(5000)
      .pipe(
        switchMap(() => {
          if (this.devices.length != 0) {
            return this.getAllDeviceData();
          } else {
            return of(null);
          }
        })
      ).subscribe((res) => {
        if (res.success && res.data) {
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

  public updateDeviceData(device: shDevice): Observable<shDevice> {
    if (!device.id || !this.devices.includes(device)) {
      return of(device); // Return current state if nothing to do
    }

    return this.getDeviceDataById(device.id).pipe(
      map(resp => {
        if (resp.data && resp.success) {
          const updatedDevice = { ...device, data: resp.data }; // immutable update
          const index = this.devices.findIndex(d => d.id === device.id);
          if (index !== -1) {
            this.devices[index] = updatedDevice;
            console.log(this.devices[index]);
          }
          return updatedDevice;
        }
        return device; // fallback to original if fetch fails
      })
    );
  }

  public getDeviceDataById(deviceId: String) : Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/data/" + deviceId, { headers });
  }

  public getAllDeviceData() : Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(ROOT_URL + DEVICE_ENDPOINT + "get/data", { headers });
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
