import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  @Output() changeDetected: EventEmitter<any> = new EventEmitter();

  public usersUrl: string;

  constructor(public http: HttpClient) {
    this.usersUrl = 'http://localhost:4200/';
  }

  public test(): Observable<any> {
    return this.http.get<any>(this.usersUrl+"test");
  }

}