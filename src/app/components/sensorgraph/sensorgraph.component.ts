import { Component, Input, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { shDeviceReading } from "../../interfaces/devicereading.interface";
import { Chart, ChartConfiguration } from "chart.js";
import 'chart.js/auto';
import {CommonComponent} from "../common/common/common.component";

@Component({
  selector: 'sensorgraph',
  templateUrl: './sensorgraph.component.html',
  styleUrls: ['./sensorgraph.component.css']
})
export class SensorGraphComponent extends CommonComponent {
  @Input() deviceId: string | undefined;
  @Input() selectedSensor: string = 'voltage';
  @Input() selectedTimescale: string = 'day';

  private chart!: Chart;

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadData();
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['selectedSensor'] || changes['selectedTimescale'] || changes['deviceId']) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.deviceId) return;

    const { start, end } = this.computeTimeRange(this.selectedTimescale);

    this.addSubscription(
      this.deviceService.getSensorReadingsByDeviceId(this.deviceId, start, end)
        .subscribe(resp => {
          const readings: shDeviceReading[] = resp.data || [];

          // Filter for selected sensor
          const filtered = readings.filter(r => r.metadata.name === this.selectedSensor);
          if (filtered.length === 0) {
            this.openSnackBar("No readings to display", "Ok");
            if (this.chart) this.chart.destroy();
            return;
          }

          const labels = filtered.map(r => new Date(r.timestamp).toLocaleString());
          const data = filtered.map(r => r.value as number);

          const textColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--sh-offwhite')
            .trim();
          const lineColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--sh-lightblue')
            .trim();

          const config: ChartConfiguration<'line'> = {
            type: 'line',
            data: {
              labels,
              datasets: [{
                label: this.selectedSensor,
                data,
                borderColor: lineColor,
                fill: false
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { ticks: { color: textColor } },
                y: { ticks: { color: textColor } }
              },
              plugins: {
                legend: { labels: { color: textColor } }
              }
            }
          };

          const canvas = document.getElementById('sensorChart') as HTMLCanvasElement;
          if (this.chart) this.chart.destroy();
          this.chart = new Chart(canvas, config);
        })
    );
  }

  private computeTimeRange(timescale: string): { start: string; end: string } {
    const now = new Date();
    let startDate = new Date();

    switch(timescale) {
      case 'hour': startDate.setHours(now.getHours() - 1); break;
      case 'day': startDate.setDate(now.getDate() - 1); break;
      case 'month': startDate.setMonth(now.getMonth() - 1); break;
      case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
      case '5 years': startDate.setFullYear(now.getFullYear() - 5); break;
      case 'lifetime': startDate = new Date(0); break;
      default: startDate.setDate(now.getDate() - 1);
    }

    return { start: startDate.toISOString(), end: now.toISOString() };
  }
}
