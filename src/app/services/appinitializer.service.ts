import {Injectable} from "@angular/core";
import {DeviceService} from "./device.service";
import {AuthenticationService} from "./authentication.service";
import {shDevice} from "../interfaces/device.interface";
import {shRoom} from "../interfaces/room.interface";
import {shDashboard} from "../interfaces/dashboard.interface";

@Injectable({providedIn: 'root'})
export class AppInitializerService {
  constructor(
    private authService: AuthenticationService,
    private deviceService: DeviceService
  ) {}

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.authService.checkToken()) {
        this.authService.verifyUserToken().subscribe({
          next: (resp) => {
            if (resp.success) {
              if (resp.user) {
                let rooms: shRoom[] = resp.user.rooms;
                let dashboard: shDashboard = resp.user.dashboard;
                let devices: shDevice[] = resp.devices;

                this.authService.setCurrentUser(resp.user);
                this.authService.setDashboard(dashboard);
                console.log(dashboard)
                if (rooms && this.authService.getRooms().length == 0) {
                  rooms.forEach((room: shRoom) => {
                    this.authService.addRoom(room);
                  })
                }
                if (devices && this.deviceService.getDevices().length == 0) {
                  devices.forEach((device) => {
                    this.deviceService.addDevice(device);
                  })
                }
              }
            }
            resolve();
          },
          error: err => {
            console.error('Auth verification failed', err);
            resolve(); // still resolve to boot the app
          }
        });
      } else {
        resolve(); // No token; app continues to boot
      }
    });
  }
}
