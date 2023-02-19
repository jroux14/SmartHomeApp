import { MONGO_URL } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  @Output() changeDetected: EventEmitter<any> = new EventEmitter();
  @Output() menuOpened: EventEmitter<any> = new EventEmitter();
  
  constructor(public http: HttpClient) {}

  public test(): Observable<any> {
    return this.http.get<any>(MONGO_URL+"test");
  }

}