import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable()
export class DataService {
  // Menu Emitters
  @Output() sideNavEmitter: EventEmitter<any> = new EventEmitter();
  @Output() newPanelEmitter: EventEmitter<any> = new EventEmitter();

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
