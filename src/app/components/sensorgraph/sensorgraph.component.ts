import { Component, Input } from '@angular/core';
import { CommonComponent } from '../common/common/common.component';
import {shDeviceReading} from "../../interfaces/devicereading.interface";
import {Chart, ChartConfiguration} from "chart.js";
import 'chart.js/auto';

@Component({
  selector: 'sensorgraph',
  templateUrl: './sensorgraph.component.html',
  styleUrls: ['./sensorgraph.component.css']
})
export class SensorGraphComponent extends CommonComponent {
  @Input() deviceId: string | undefined;

  private chart!: Chart;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.fetchAndRenderChart();
  }

  private fetchAndRenderChart(): void {
    const start = '2025-12-01T00:00:00Z';
    const end = '2025-12-03T23:59:59Z';

    if (this.deviceId && this.deviceId !== '') {
      this.addSubscription(this.deviceService.getSensorReadingsByDeviceId(this.deviceId, start, end).subscribe(resp => {
        let readings: shDeviceReading[] = resp.data;
        const sensorMap = new Map<string, { timestamps: string[], values: number[] }>();

        if(readings.length > 0){
          readings.forEach(r => {
            const name = r.metadata.name;
            if (!sensorMap.has(name)) {
              sensorMap.set(name, { timestamps: [], values: [] });
            }
            sensorMap.get(name)!.timestamps.push(new Date(r.timestamp).toLocaleString());
            sensorMap.get(name)!.values.push(r.value);
          });

          const firstSensor = sensorMap.values().next().value;
          const labels = firstSensor.timestamps;

          const datasets = Array.from(sensorMap.entries()).map(([name, data], i) => ({
            label: name,
            data: data.values,
            borderColor: ['red','blue','green','orange','purple','brown','cyan'][i % 7],
            fill: false,
          }));

          const config: ChartConfiguration<'line'> = {
            type: 'line',
            data: { labels, datasets },
            options: { responsive: true, maintainAspectRatio: false }
          };

          const canvas = document.getElementById('sensorChart') as HTMLCanvasElement;
          if (this.chart) {
            this.chart.destroy();
          }
          this.chart = new Chart(canvas, config);
        } else {
          this.openSnackBar("No readings to display", "Ok");
        }

      }));
    }
  }
}
