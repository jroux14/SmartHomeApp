import { MONGO_URL } from '../constants/constants.smarthome'
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
  currentUser: User | undefined;
  tempUsers: User[] = [];
  constructor(public http: HttpClient) {}

  public registerNewUser(newUser: User, confirmPwd: string) : Object {
    let userExists: boolean = false;
    let rVal: Object;
    if(newUser.fullUserName != '' && newUser.pwd != '' && confirmPwd != '') {
      this.tempUsers.forEach((user) => {
        if(user.fullUserName == newUser.fullUserName) {
          userExists = true;
        }
      });
      if(userExists) {
        rVal = {
          success: false,
          pwdMatchWarn: false,
          noData: false,
          userExists: true
        };
        return rVal
      } else {
        if (newUser.pwd == confirmPwd) {
          rVal = {
            success: true,
            pwdMatchWarn: false,
            noData: false,
            userExists: false
          };
          this.tempUsers.push(newUser);
          return rVal;
        } else {
          rVal = {
            success: false,
            pwdMatchWarn: true,
            noData: false,
            userExists: false
          };
          return rVal;
        }
      }
    } else {
      rVal = {
        success: false,
        pwdMatchWarn: false,
        noData: true,
        userExists: false
      };
      return rVal;
    }
  }

  public attemptLogin(uname: string, pwd: string) : Object {
    let rVal: Object;
    let success: boolean = false;
    if(uname != '' && pwd != '') {
      this.tempUsers.forEach((user) => {
        if(user.fullUserName == uname && user.pwd == pwd) {
          success = true;
          this.currentUser = user;
        }
      });
      if(success) {
        rVal = {
          success: true,
          invalidCreds: false,
          noData: false
        };
        return rVal;      
      } else {
        rVal = {
          success: false,
          invalidCreds: true,
          noData: false
        };
        return rVal;
      }
    } else {
      rVal = {
          success: false,
          invalidCreds: false,
          noData: true
      };
      return rVal;
    }
  }

  getUserByUsername(username: string) : User | undefined {
    let rVal: User | undefined;
    this.tempUsers.forEach( (user) => {
      if(user.fullUserName == username) {
        rVal = user;
      }
    });

    return rVal;
  }

}