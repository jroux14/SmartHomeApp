import { MONGO_URL } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  @Output() dropdownEmitter: EventEmitter<any> = new EventEmitter();
  @Output() openLoginEmitter: EventEmitter<any> = new EventEmitter();
  @Output() closeLoginEmitter: EventEmitter<any> = new EventEmitter();
  @Output() openNewAccountEmitter: EventEmitter<any> = new EventEmitter();
  @Output() closeNewAccountEmitter: EventEmitter<any> = new EventEmitter();
  @Output() checkLoginEmitter: EventEmitter<any> = new EventEmitter();
  @Output() createUserEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateUsernameEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updatePasswordEmitter: EventEmitter<any> = new EventEmitter();
  @Output() confirmPasswordEmitter: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient) {}

  public test(): Observable<any> {
    return this.http.get<any>(MONGO_URL+"test");
  }

}