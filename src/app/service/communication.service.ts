import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CommunicationService {

  private usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = 'http://smarthome-client:8080/test';
  }

  public test(): Observable<any> {
    return this.http.get<any>(this.usersUrl);
  }
}