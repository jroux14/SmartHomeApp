import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '../../common/common/common.component';

@Component({
  selector: 'common',
  templateUrl: './common-input.component.html',
  styleUrls: ['./common-input.component.css']
})
export class CommonInputComponent extends CommonComponent {
  @Input()
  onChangeEmitter: EventEmitter<any> | undefined;
  @Input()
  onChange: ((args: any) => any) = this.nada;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  nada(args: any) {

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