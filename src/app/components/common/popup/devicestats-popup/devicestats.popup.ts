import {Component, inject, Inject} from "@angular/core";
import {CommonComponent} from "../../common/common.component";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {shDevice} from "../../../../interfaces/device.interface";

@Component({
  selector: 'devicestats-popup',
  templateUrl: 'devicestats.popup.html',
  styleUrls: ['devicestats.popup.css'],
})
export class DeviceStatsPopup extends CommonComponent {
  data: any = inject(MAT_DIALOG_DATA, { optional: true });
  device: shDevice | undefined;

  override ngOnInit() {
    super.ngOnInit();
    this.device = this.data.device;
  }

  getDeviceId(): string {
    if (this.device && this.device.id) {
      return this.device.id;
    } else {
      return '';
    }
  }
}
