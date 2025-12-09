import { Component, Input, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { shDeviceReading } from "../../interfaces/devicereading.interface";
import { Chart, ChartConfiguration } from "chart.js";
import 'chartjs-adapter-date-fns';
import 'chart.js/auto';
import {CommonComponent} from "../common/common/common.component";
import {Observable} from "rxjs";

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

  private getAggregateObservable(): Observable<any> {
    if (!this.deviceId) throw new Error('Device ID not set');
    const sensor = this.selectedSensor;

    // Compute start/end based on timescale
    const { start, end } = this.computeTimeRange(this.selectedTimescale);

    switch (this.selectedTimescale) {
      case 'hour':
        // last hour of raw readings
        return this.deviceService.getSensorReadingsByDeviceId(this.deviceId, start, end);

      case 'day':
        // aggregated hourly readings for the day
        return this.deviceService.getHourlySensorReadingsByDeviceId(this.deviceId, sensor, start, end);

      case 'month':
        // aggregated daily readings for the month
        return this.deviceService.getDailySensorReadingsByDeviceId(this.deviceId, sensor, start, end);

      case 'year':
        // aggregated monthly readings for the year
        return this.deviceService.getMonthlySensorReadingsByDeviceId(this.deviceId, sensor, start, end);

      case 'five_years':
      case 'lifetime':
        const startYear = new Date(start).getFullYear();
        const endYear = new Date(end).getFullYear();
        return this.deviceService.getYearlySensorReadingsByDeviceId(this.deviceId, sensor, startYear, endYear);

      default:
        // fallback to last hour raw readings
        return this.deviceService.getSensorReadingsByDeviceId(this.deviceId, start, end);
    }
  }


  private loadData(): void {
    if (!this.deviceId) return;

    this.addSubscription(
      this.getAggregateObservable().subscribe(resp => {
        if (!resp.success || !resp.data.length) {
          this.openSnackBar(resp.error || 'No readings to display', 'Ok');
          if (this.chart) this.chart.destroy();
          return;
        }

        let readings = resp.data;

        // Sort ascending by timestamp
        readings.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        // Map labels & values depending on schema
        let labels: string[] = [];
        let data: number[] = [];

        if (this.selectedTimescale === 'hour') {
          // raw readings
          const sensor = this.selectedSensor;
          const filtered = readings.filter((r: any) => r.metadata.name === sensor);
          labels = filtered.map((r: any) => r.timestamp);
          data = filtered.map((r: any) => r.value);
        } else {
          // aggregated readings
          labels = readings.map((r: any) => r.timestamp);
          data = readings.map((r: any) => r.avg);
        }

        this.renderChart(labels, data);
      })
    );
  }

  private renderChart(labels: string[], data: number[]): void {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--sh-offwhite').trim();
    const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--sh-lightblue').trim();

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
            time: { unit: this.getTimeUnit(this.selectedTimescale) },
            ticks: {
              color: textColor,
              autoSkip: true,
              maxRotation: 0
            }
          },
          y: { ticks: { color: textColor } }
        },
        plugins: { legend: { labels: { color: textColor } } },
      }
    };

    const canvas = document.getElementById('sensorChart') as HTMLCanvasElement;
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(canvas, config);
  }

  getTimeUnit(scale: string): any {
    switch(scale) {
      case 'hour': return 'minute';   // multiple readings per hour → group by minutes
      case 'day': return 'hour';
      case 'month': return 'day';
      case 'year': return 'month';
      case 'five_years':
      case 'lifetime':
        return 'year';
      default:
        return 'day';
    }
  }


  private computeTimeRange(timescale: string): { start: string; end: string } {
    const now = new Date();
    let start: Date;

    switch (timescale) {
      case 'hour':
        start = new Date(now.getTime() - 60 * 60 * 1000); // last hour
        break;
      case 'day':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000); // last 24 hours
        break;
      case 'month':
        start = new Date();
        start.setMonth(now.getMonth() - 1); // last month
        break;
      case 'year':
        start = new Date();
        start.setFullYear(now.getFullYear() - 1); // last year
        break;
      case 'five_years':
        start = new Date();
        start.setFullYear(now.getFullYear() - 5); // last 5 years
        break;
      case 'lifetime':
        start = new Date(0); // epoch
        break;
      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000); // fallback last 24h
    }

    return {
      start: start.toISOString(),
      end: now.toISOString()
    };
  }
}
