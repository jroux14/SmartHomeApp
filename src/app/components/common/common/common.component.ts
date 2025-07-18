import {
  AfterViewInit,
  Component,
  Injector,
  KeyValueDiffers,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { PopupService } from 'src/app/services/popup.service';
import { DeviceService } from 'src/app/services/device.service';
import {MatBottomSheet} from "@angular/material/bottom-sheet";

@Component({
  selector: 'common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  static injector: Injector;

  destroy$ = new Subject<void>();
  subscriptions: Subscription[] = [];

  links: string[] = ['', '/devices', '/settings'];
  linkText: string[] = ['Dashboard', 'Devices', 'Settings'];
  linkIcons: string[] = ['dashboard', 'device_hub', 'settings'];

  constructor(public dataService: DataService, public authService: AuthenticationService, public deviceService: DeviceService, public popupService: PopupService, public bottomSheet: MatBottomSheet, public snackBar: MatSnackBar, public differs: KeyValueDiffers, public injector: Injector) {
    CommonComponent.injector = injector;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(function (subscription) {
      try {
        subscription.unsubscribe();
      } catch(e){}
    });
    this.destroy$.next();
    this.destroy$.complete();
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
}
