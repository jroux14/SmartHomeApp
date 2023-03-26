import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'common',
  templateUrl: './common-input.component.html',
  styleUrls: ['./common-input.component.css']
})
export class CommonInputComponent implements OnChanges, OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  @Input()
  onChangeEmitter: EventEmitter<any> | undefined;
  @Input()
  onChange: ((args: any) => void) | undefined;

  constructor(public dataService: DataService, public dialog: MatDialog) {}

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

  onChangeDetected(data: any) {
    if(this.onChangeEmitter) {
      this.onChangeEmitter.emit(data);
    }
    if(this.onChange) {
      this.onChange(data);
    }
  }
  
}