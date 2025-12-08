import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable()
export class DataService {
  // Menu Emitters
  @Output() sideNavEmitter: EventEmitter<any> = new EventEmitter();
  @Output() newPanelEmitter: EventEmitter<any> = new EventEmitter();
  @Output() editModeEmitter: EventEmitter<any> = new EventEmitter();
  @Output() checkForOverflowEmitter: EventEmitter<any> = new EventEmitter();

  private TIMESCALES: Record<string, {
    display: string;
    format: (d: Date) => string;
  }> = {
    hour: {
      display: "Last Hour",
      format: d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    day: {
      display: "Last Day",
      format: d => d.toLocaleTimeString([], { hour: '2-digit' })
    },
    month: {
      display: "Last Month",
      format: d => d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    },
    year: {
      display: "Last Year",
      format: d => d.toLocaleDateString([], { month: 'short' })
    },
    five_years: {
      display: "Last 5 Years",
      format: d => d.getFullYear().toString()
    },
    lifetime: {
      display: "All Time",
      format: d => d.getFullYear().toString()
    }
  };
  private timescaleKeys: string[] = Object.keys(this.TIMESCALES);

  private editMode: boolean = false;

  sideNav: MatSidenav | undefined;
  sideNavSubject = new BehaviorSubject<any>(null);

  constructor(public http: HttpClient) {}

  getEditMode(): boolean {
    return this.editMode;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.editModeEmitter.emit(this.editMode);
  }

  setSideNav(newSideNav: MatSidenav) {
    this.sideNav = newSideNav;
    this.sideNavSubject.next(this.sideNav);
  }

  getSideNav(): MatSidenav | undefined {
    return this.sideNav;
  }

  getTimescales(): Record<string, { display: string; format: (d: Date) => string; }> {
    return this.TIMESCALES;
  }

  getTimescaleKeys(): string[] {
    return this.timescaleKeys;
  }
}
