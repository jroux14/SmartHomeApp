import {Component, Input} from '@angular/core';
import { CommonComponent } from '../common/common.component';
import {shPanel} from "../../../interfaces/panel.interface";
import {DEVICE_ROOM_FILTER_VALUE} from "../../../constants/constants.smarthome";
import {shRoom} from "../../../interfaces/room.interface";
import {shDevice} from "../../../interfaces/device.interface";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'sh-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent extends CommonComponent{

  @Input()
  panel: shPanel | undefined;

  filterList: any[] | undefined;
  selectedFilterControl: FormControl<any | null> = new FormControl<any | null>(null);

  override ngOnInit() {
    super.ngOnInit();

    if (this.panel) {
      if (this.panel.panelFilterCriteria == DEVICE_ROOM_FILTER_VALUE) {
        this.filterList = this.authService.getRooms();
        this.selectedFilterControl.setValue(this.filterList[0]);
      }
    }
  }

  trackByDeviceId(index: number, device: shDevice): string | undefined {
    return device.id;
  }
}
