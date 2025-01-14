import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import {
  MatDialog, 
  MatDialogConfig, 
  MatDialogRef
} from '@angular/material/dialog';
import { LoginPopupComponent } from '../popup/login-popup/login-popup.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TYPE_SWITCH, TYPE_SENSOR, MONGO_URL } from 'src/app/constants/constants.smarthome';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { PopupService } from 'src/app/services/popup.service';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService, public authService: AuthenticationService, public popupService: PopupService, public snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(function (subscription) {
      try {
        subscription.unsubscribe();
      } catch(e){}
    });
  }

  addSubscription(sub: Subscription) {
    this.subscriptions.push(sub);
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<TextOnlySnackBar> {
    const config: MatSnackBarConfig = {
      panelClass: ['sh-snackbar'] 
    };
    return this.snackBar.open(message, action, config)
  }

  resolvePopupSnackBar(message: string, action: string, popup: ComponentType<unknown>, popupConfig?: MatDialogConfig<any>) {
    this.popupService.closePopup();
    console.log(message);
    let ref = this.openSnackBar(message, action);
    if (popupConfig) {
      ref.onAction().subscribe(() => {
        this.popupService.openPopup(popup, popupConfig);    
      });
    } else {
      ref.onAction().subscribe(() => {
        this.popupService.openPopup(popup, {
          panelClass: 'baseDialog'
        });    
      });
    }
  }
}