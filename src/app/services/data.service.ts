import { MONGO_URL } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  // Menu Emitters
  // @Output() dropdownEmitter: EventEmitter<any> = new EventEmitter();
  
  // Auth Emitters
  @Output() userChangeEmitter: EventEmitter<any> = new EventEmitter();

  // Popup Emitters
  @Output() openLoginEmitter: EventEmitter<any> = new EventEmitter();
  @Output() closeLoginEmitter: EventEmitter<any> = new EventEmitter();
  @Output() openNewAccountEmitter: EventEmitter<any> = new EventEmitter();
  @Output() closeNewAccountEmitter: EventEmitter<any> = new EventEmitter();

  // Device Emitters
  @Output() addDeviceEmitter: EventEmitter<any> = new EventEmitter();
  @Output() closeDevicePopupEmitter: EventEmitter<any> = new EventEmitter();
  @Output() forwardNewDeviceEmitter: EventEmitter<any> = new EventEmitter();
  @Output() deleteDeviceEmitter: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient) {}

  public test(): Observable<any> {
    return this.http.get<any>(MONGO_URL+"test");
  }

  public getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(MONGO_URL+"user/getUser");
  }

}