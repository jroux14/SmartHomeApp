import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { shUser } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { MONGO_URL } from '../constants/constants.smarthome';

@Injectable()
export class AuthenticationService {

  // Auth Emitters
  @Output() userChangeEmitter: EventEmitter<any> = new EventEmitter();

  currentUser: shUser | undefined;
  tempUsers: shUser[] = [];
  constructor(public http: HttpClient) {}

  public registerNewUser(userData: any) : Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (!userData) {
      userData = {};
    }
    return this.http.post<any>(MONGO_URL+"auth/create", userData, { headers});
  }

  public attemptLogin(userData: any) : Observable<any> {
    const headers = new HttpHeaders({'Content-Type':'application/json',});
    if (!userData) {
      userData = {};
    }
    return this.http.post<any>(MONGO_URL+"auth/login", userData, { headers });
  }

  public testAuth() : Observable<any> {
    return this.http.get<any>(MONGO_URL+"user/test");
  }

  getUserByUserID(userID: string) : Observable<any> {
    return this.http.get<any>(MONGO_URL+"user/get/id/"+userID);
  }

  getUserByUsername(username: string) : Observable<any> {
    return this.http.get<any>(MONGO_URL+"user/get/username/"+username);
  }

  getUserInfo() : Observable<any> {
    return this.http.get<any>(MONGO_URL+"user/get")
  }

  setCurrentUser(user: shUser, token?: string, refreshToken?: string) {
    this.currentUser = user;
    if (token) {
      localStorage.setItem("bearerToken", token);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    this.userChangeEmitter.emit();
  }
  
  clearCurrentUser() {
    this.currentUser = undefined;
    localStorage.removeItem("bearerToken");
    localStorage.removeItem("refreshToken");
    this.userChangeEmitter.emit();
  }

  checkToken() {
    if (localStorage.getItem("bearerToken") && localStorage.getItem("refreshToken")) {
      return true;
    } else {
      return false;
    }
  }

}