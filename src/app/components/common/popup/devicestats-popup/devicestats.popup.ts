import { Component, inject } from "@angular/core";
import { CommonComponent } from "../../common/common.component";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { shDevice } from "../../../../interfaces/device.interface";

@Component({
  selector: 'devicestats-popup',
  templateUrl: 'devicestats.popup.html',
  styleUrls: ['devicestats.popup.css'],
})
export class DeviceStatsPopup extends CommonComponent {
  data: any = inject(MAT_DIALOG_DATA, { optional: true });
  device: shDevice | undefined;

  sensorTypes: string[] = [];
  timescales: Record<string, { display: string; format: (d: Date) => string; }> | undefined;
  timescaleKeys: string[] | undefined;

  selectedSensor: string = 'voltage';
  selectedTimescale: string = 'day';

  override ngOnInit() {
    super.ngOnInit();
    this.device = this.data.device;
    if (this.device && this.device.data.sensors) {
      this.sensorTypes = Object.keys(this.device.data.sensors);
      this.selectedSensor = this.sensorTypes[0];
    }
    this.timescales = this.dataService.getTimescales();
    this.timescaleKeys = this.dataService.getTimescaleKeys();
  }

  getDeviceId(): string {
    return this.device?.id ?? '';
  }

  onSensorChange(sensor: string) {
    this.selectedSensor = sensor;
  }

  onTimescaleChange(timescale: string) {
    this.selectedTimescale = timescale;
  }
}
