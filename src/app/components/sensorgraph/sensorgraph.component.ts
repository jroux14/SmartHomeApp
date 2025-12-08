import { Component, Input, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { shDeviceReading } from "../../interfaces/devicereading.interface";
import { Chart, ChartConfiguration } from "chart.js";
import 'chartjs-adapter-date-fns';
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

          const labels = filtered.map(r => r.timestamp); // raw ISO timestamps
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
                fill: false,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: this.getTimeUnit(this.selectedTimescale)
                  },
                  ticks: {
                    color: textColor,
                    callback: (value) => {
                      const d = new Date(value as number);
                      return this.dataService.getTimescales()[this.selectedTimescale].format(d);
                    }
                  }
                },
                y: { ticks: { color: textColor } }
              },
              plugins: {
                legend: { labels: { color: textColor } }
              },
            }
          };

          const canvas = document.getElementById('sensorChart') as HTMLCanvasElement;
          if (this.chart) this.chart.destroy();
          this.chart = new Chart(canvas, config);
        })
    );
  }

  getTimeUnit(scale: string): any {
    switch(scale) {
      case 'hour': return 'minute';   // multiple readings per hour → group by minutes
      case 'day': return 'hour';
      case 'month': return 'day';
      case 'year': return 'month';
      case '5 years':
      case 'lifetime':
        return 'year';
      default:
        return 'day';
    }
  }


  private computeTimeRange(timescale: string): { start: string; end: string } {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (timescale) {
      case 'hour': {
        // Last 60 minutes
        start = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      }
      case 'day': {
        // Today 00:00:00 → now
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        break;
      }
      case 'month': {
        // First day of THIS month → now
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      }
      case 'year': {
        // Jan 1st THIS year → now
        start = new Date(now.getFullYear(), 0, 1);
        break;
      }
      case 'five_years': {
        // Jan 1st of (current year - 5)
        start = new Date(now.getFullYear() - 5, 0, 1);
        break;
      }
      case 'lifetime': {
        // Start of epoch
        start = new Date(0);
        break;
      }
      default:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    }
    return {
      start: start.toISOString(),
      end: end.toISOString()
    };
  }
}
