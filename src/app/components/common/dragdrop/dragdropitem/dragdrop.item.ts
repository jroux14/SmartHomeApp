import {Component, Input, OnInit} from '@angular/core';
import {GridsterComponent, GridsterItemComponent} from 'angular-gridster2';
import { CommonComponent } from '../../common/common.component';
import { shDevice } from 'src/app/interfaces/device.interface';

@Component({
  selector: 'dragdrop-item',
  templateUrl: './dragdrop.item.html',
  styleUrls: ['./dragdrop.item.css'],
})
export class DragDropItemComponent extends CommonComponent{
  @Input()
  thisDevice: shDevice | undefined;

  deviceName: string = '';
  deviceType: string = '';

  override ngOnInit() {
    super.ngOnInit();
    if(this.thisDevice) {
      this.deviceName = this.thisDevice.deviceName;
      this.deviceType = this.thisDevice.deviceType;
    }
  }

}
