import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { shUser } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { AUTH_ENDPOINT, ROOT_URL, USER_ENDPOINT } from '../constants/constants.smarthome';

@Injectable()
export class AuthenticationService {

  // Auth Emitters
  @Output() userChangeEmitter: EventEmitter<any> = new EventEmitter();

  private currentUser: shUser | undefined;

  constructor(public http: HttpClient) {}

  public registerNewUser(userData: any) : Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (!userData) {
      userData = {};
    }
    return this.http.post<any>(ROOT_URL+"auth/create", userData, { headers});
  }

  public attemptLogin(userData: any) : Observable<any> {
    const headers = new HttpHeaders({'Content-Type':'application/json',});
    if (!userData) {
      userData = {};
    }
    return this.http.post<any>(ROOT_URL + AUTH_ENDPOINT + "login", userData, { headers });
  }

  public testAuth() : Observable<any> {
    return this.http.get<any>(ROOT_URL + USER_ENDPOINT + "test");
  }

  verifyUserToken() : Observable<any> {
    return this.http.get<any>(ROOT_URL + AUTH_ENDPOINT + "verify")
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

  getCurrentUser(): shUser | undefined {
    return this.currentUser;
  }

  getCurrentUserName(): string {
    if (this.currentUser) {
      return this.currentUser.firstName
    } else {
      return '';
    }
  }

  getCurrentUserId(): string {
    if (this.currentUser) {
      return this.currentUser.userId;
    } else {
      return '';
    }
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