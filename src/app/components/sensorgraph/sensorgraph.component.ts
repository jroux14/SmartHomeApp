import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { shDevice } from 'src/app/interfaces/device.interface';
import { CommonComponent } from '../common/common/common.component';

@Component({
  selector: 'sensorgraph',
  templateUrl: './sensorgraph.component.html',
  styleUrls: ['./sensorgraph.component.css']
})
export class SensorGraphComponent extends CommonComponent {
  @Input()
  device: shDevice | undefined;
  @Input()
  componentID: string = '';

  graphCtx: any;
  thisChart: Chart | undefined

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.initGraph();
  }

  initGraph() {
    if(this.componentID != '') {
        this.graphCtx = document.getElementById(this.componentID);
    }
    if(this.graphCtx) {
        let chart = new Chart(this.graphCtx, {
            type: 'line',
            data: {
                labels: ['07:32:57','10:12:05','12:42:37','13:50:39','16:25:45','20:37:59'],
                datasets: [
                    {
                        label: 'test',
                        data: [1, 2, 3, 4, 5, 6]
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Degrees F'
                        },
                    },
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time (hh:mm:ss)'
                        },
                    }
                },
                maintainAspectRatio: false
            }
        });

        if(chart) {
            this.thisChart = chart;
        }

    }

  }

}
