import { Component, OnInit, Input } from '@angular/core';
import { CommonComponent } from '../common/common.component';
import { DropDownAnimation } from 'src/app/animations/animations';
import { LoginPopupComponent } from '../popup/login-popup/login-popup.component';
import { finalize, firstValueFrom, lastValueFrom, Observable, Subscription, switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, TextOnlySnackBar } from '@angular/material/snack-bar';
import { shUser } from 'src/app/interfaces/user.interface';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'sh-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  animations: [ DropDownAnimation ]
})
export class DropdownComponent extends CommonComponent {
  @Input() 
  showUser: boolean = false;

  isOpen: boolean = false;
  loggedIn: boolean = false;
  showLogout: boolean = false;
  userName: string = '';
  userVal: string = '';
  pwdVal: string = '';
  links: string[] = ['', 'settings'];
  linkText: string[] = ['Dashboard', 'Settings'];
  linkIcons: string[] = ['dashboard', 'settings'];

  override ngOnInit(): void {
    super.ngOnInit();
    this.addSubscription(this.dataService.userChangeEmitter.subscribe(data => {
      if(this.authService.currentUser) {
        this.userName = this.authService.currentUser.firstName;
        this.loggedIn = true;
        this.showUser = true;
      } else {
        this.userName = '';
        this.loggedIn = false;
        this.showUser = false;
        this.popupService.openPopup(LoginPopupComponent, {         
          panelClass: 'loginDialog',
          disableClose: true})
        }
    }));
  }

  toggle() {
    this.isOpen = !this.isOpen;
    // if(this.isOpen) {
    //   this.dataService.dropdownEmitter.emit();
    // }
  }

  onLogin() {
    if (this.loggedIn) {
      this.showLogout = !this.showLogout;
    }
  }

  testAuth() {
    this.authService.testAuth().subscribe(resp => {
      console.log(resp);
    });
  }
  // async onLogin() {
  //   let snackBarMsg: string = '';
  //   let loginAtt: Subscription | null = null;
  //   let snackbarref: MatSnackBarRef<TextOnlySnackBar> | null = null;
  //   let initData: any = {
  //     firstName: '',
  //     userVal: '',
  //     pwdVal: '',
  //     confirmPwd: '',
  //     isNewUser: false
  //   }
    
  //   if(!this.loggedIn) {
  //     const dialogRef = this.popupService.openPopup(LoginPopupComponent, {
  //       data: initData,
  //       panelClass: 'loginDialog'
  //     });
  //     const data = await lastValueFrom(dialogRef.afterClosed());
  //     console.log(data);
  //     if (data) {
  //       this.userVal = data.userVal;
  //       this.pwdVal = data.pwdVal;
  //       if (this.userVal != '' && this.pwdVal != '') {
  //         if (data.isNewUser) {
  //           let newUID: string = uuidv4();
  //           let newUser: shUser = {
  //             userID: newUID,
  //             username: data.userVal,
  //             firstName: data.firstName,
  //             pwd: data.pwdVal
  //           };
  //           this.authService.registerNewUser(newUser, data.confirmPwd).subscribe((result) => {
  //             console.log(result);
  //             if (!result.success) {
  //               // if (result.invalidPasswordError) {
  //               //   this.snackBar.open("Invalid Password");
  //               // } else if (result.)
  //             } 
  //           });
  //         } else {
  //           let data: any = await lastValueFrom(this.authService.attemptLogin(this.userVal, this.pwdVal));
  //           if (data) {
  //             if (!data.success) {
  //               if (data.invalidPasswordError) {
  //                 snackBarMsg = "Invalid Password";
  //               } else if (data.badCredentialsError) {
  //                 snackBarMsg = "Username or password is incorrect";
  //               } else {
  //                 snackBarMsg = "Unknown Error";
  //               }
  //             } else {
  //               this.authService.currentUser = data.user;
  //               this.userName = data.user.firstName;
  //               this.showLogout = true;
  //               this.loggedIn = true;
  //             }
  //           }
  //         }
  //       } else {
  //         snackBarMsg = "Fill all fields";
  //       } 
  //       if (snackBarMsg) {
  //         snackbarref = this.openSnackBar(snackBarMsg, "Try Again");
  //         await lastValueFrom(snackbarref.onAction());
  //         this.onLogin();
  //       }
  //     }
  //   } 
  // }

  logout() {
    this.showLogout = false;
    this.loggedIn = false;
    this.showUser = false;
    this.authService.setCurrentUser(undefined);
    this.dataService.userChangeEmitter.emit();
  }
}
