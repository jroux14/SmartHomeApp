import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shUser } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { MONGO_URL } from '../constants/constants.smarthome';

@Injectable()
export class AuthenticationService {
  currentUser: shUser | undefined;
  tempUsers: shUser[] = [];
  constructor(public http: HttpClient) {}

  public registerNewUser(newUser: shUser, confirmPwd: string) : Observable<any> {
    return this.http.put<any>(MONGO_URL+"user/create/"+confirmPwd, newUser);
  }

  public attemptLogin(uname: string, pwd: string) : Observable<any> {
    if(uname == "" || pwd == "") {
      return this.http.get<any>(MONGO_URL+"user/login");
    } else {
      return this.http.get<any>(MONGO_URL+"user/login/"+uname+"/"+pwd);
    }
  }

  getUserByUserID(userID: string) : Observable<any> {
    return this.http.get<any>(MONGO_URL+"user/get/id/"+userID);
  }

  getUserByUsername(username: string) : Observable<any> {
    return this.http.get<any>(MONGO_URL+"user/get/username/"+username);
  }

  setCurrentUser(user: shUser) {
    this.currentUser = user;
  }

}