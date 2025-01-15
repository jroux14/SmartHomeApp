import { DEVICE_ENDPOINT, ROOT_URL, USER_ENDPOINT } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { shDevice } from '../interfaces/device.interface';

@Injectable()
export class DataService {
  // Menu Emitters
  @Output() sideNavEmitter: EventEmitter<any> = new EventEmitter();

  sideNav: MatSidenav | undefined;
  sideNavSubject = new BehaviorSubject<any>(null);

  constructor(public http: HttpClient) {}

  setSideNav(newSideNav: MatSidenav) {
    this.sideNav = newSideNav;
    this.sideNavSubject.next(this.sideNav);
  }

  getSideNav(): MatSidenav | undefined {
    return this.sideNav;
  }
}