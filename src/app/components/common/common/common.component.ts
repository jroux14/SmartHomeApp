import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginPopupComponent } from '../popup/login-popup/login-popup.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

type User = {
  userID: string,
  fullUserName: string,
  fName: string
}

@Component({
  selector: 'common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnChanges, OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService, public authService: AuthenticationService, public dialog: MatDialog) {}

  ngOnInit(): void {}

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

  
}