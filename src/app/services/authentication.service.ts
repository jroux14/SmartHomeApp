import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { shUser } from '../interfaces/user.interface';
import {Observable, of} from 'rxjs';
import {AUTH_ENDPOINT, DEVICE_ENDPOINT, ROOT_URL} from '../constants/constants.smarthome';
import {shRoom} from "../interfaces/room.interface";
import {shDashboard} from "../interfaces/dashboard.interface";
import {shPanel} from "../interfaces/panel.interface";
import {shDevice} from "../interfaces/device.interface";

@Injectable()
export class AuthenticationService {

  // Auth Emitters
  @Output() userChangeEmitter: EventEmitter<any> = new EventEmitter();
  @Output() newRoomEmitter: EventEmitter<any> = new EventEmitter();

  private currentUser: shUser | undefined;

  private roomList: shRoom[] = [];

  private dashboard: shDashboard | undefined;

  constructor(public http: HttpClient) {}

  public clearRooms() {
    this.roomList = [];
  }

  public setDashboard(dashboard: shDashboard) {
    this.dashboard = dashboard;
  }

  public addPanel(panel: shPanel) {
    if (this.dashboard) {
      this.dashboard.panels.push(panel);
    }
  }

  public deletePanel(panel: shPanel): Observable<any> {
    if (this.dashboard) {
      this.dashboard.panels.splice(this.dashboard.panels.indexOf(panel), 1);
      return this.http.post<any>(ROOT_URL + AUTH_ENDPOINT + "delete/panel", panel);
    } else {
      return of(null);
    }
  }

  public updatePanelPosition(panel: shPanel): Observable<any> {
    return this.http.post(ROOT_URL + AUTH_ENDPOINT + "update/panel", panel);
  }

  public getDashboardPanels(): shPanel[] {
    if (this.dashboard) {
      return this.dashboard.panels;
    } else {
      return [];
    }
  }

  public getRoom(room: shRoom): shRoom | undefined {
    return this.roomList.find((room) => room);
  }

  public getRooms(): shRoom[] {
    return this.roomList;
  }

  public addRoom(room: shRoom) {
    if (!this.roomList.includes(room)) {
      this.roomList.push(room);
    }
  }

  public registerNewPanel(newPanel: shPanel): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (!newPanel) {
      newPanel = new shPanel('', '');
    }
    return this.http.post(ROOT_URL + AUTH_ENDPOINT + 'private/add/panel', newPanel, { headers});
  }

  public registerNewUser(userData: any) : Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (!userData) {
      userData = {};
    }
    return this.http.post<any>(ROOT_URL + AUTH_ENDPOINT + "public/create", userData, { headers });
  }

  public attemptLogin(userData: any) : Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type':'application/json' });
    if (!userData) {
      userData = {};
    }
    return this.http.post<any>(ROOT_URL + AUTH_ENDPOINT + "public/login", userData, { headers });
  }

  public logout() : Observable<any> {
    return this.http.get<any>(ROOT_URL + AUTH_ENDPOINT + "private/logout");
  }

  public createRoom(roomName: string) : Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type':'application/json' });
    return this.http.post(ROOT_URL + AUTH_ENDPOINT + "private/add/room", { name: roomName }, { headers });
  }

  verifyUserToken() : Observable<any> {
    return this.http.get<any>(ROOT_URL + AUTH_ENDPOINT + "private/verify")
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
    return !!(localStorage.getItem("bearerToken") && localStorage.getItem("refreshToken"));
  }
}
