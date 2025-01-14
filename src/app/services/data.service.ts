import { MONGO_URL } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable()
export class DataService {
  // Menu Emitters
  @Output() sideNavEmitter: EventEmitter<any> = new EventEmitter();

  // Device Emitters
  @Output() forwardNewDeviceEmitter: EventEmitter<any> = new EventEmitter();
  @Output() deleteDeviceEmitter: EventEmitter<any> = new EventEmitter();

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

  public test(): Observable<any> {
    return this.http.get<any>(MONGO_URL+"test");
  }

  public getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(MONGO_URL+"user/getUser");
  }

}