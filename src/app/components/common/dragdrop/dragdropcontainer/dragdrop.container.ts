import {Component, HostListener, OnInit} from '@angular/core';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType,
} from "angular-gridster2";
import { CommonComponent } from '../../common/common.component';

@Component({
  selector: 'dragdrop-container',
  templateUrl: './dragdrop.container.html',
  styleUrls: ['./dragdrop.container.css'],
})
export class DragDropContainerComponent extends CommonComponent{
  options!: GridsterConfig;
  dashboard!: GridsterItem[];
  
  @HostListener('window:resize', ['$event'])
  sizeChange(event: any) {
    console.log('size changed.', event);
    if(event.target.innerWidth && event.target.innerHeight && this.options.api && this.options.api.optionsChanged && this.options.fixedColWidth) {
      this.options.minCols = (event.target.innerWidth-800) / this.options.fixedColWidth;
      this.options.maxCols = (event.target.innerWidth-800) / this.options.fixedColWidth;
      if(this.options.minCols < 5) {
        this.options.minCols = (event.target.innerWidth-500) / this.options.fixedColWidth;
        this.options.maxCols = (event.target.innerWidth-500) / this.options.fixedColWidth;
        this.options.emptyCellDragMaxCols = (event.target.innerWidth-500) / this.options.fixedColWidth;
        this.options.emptyCellDragMaxRows = (event.target.innerWidth-500) / this.options.fixedColWidth;
      }
      for(let i = 0; i < this.dashboard.length; i++) {
        if(this.dashboard[i].x > this.options.maxCols) {
          this.dashboard[i].x = this.options.maxCols-1;
        }
      }
      this.changedOptions();
      this.options.api.resize!();
      console.log(this.options.minCols);
    }
  }

  override ngOnInit() {
    super.ngOnInit();
    this.options = {
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.None,
      setGridSize: true,
      fixedColWidth: 250,
      fixedRowHeight: 250,
      margin:30,
      outerMarginLeft: 250,
      outerMarginTop: 50,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      mobileBreakpoint: 640,
      useBodyForBreakpoint: false,
      swap: true,
      pushItems: false,
      enableEmptyCellDrop: true,
      enableOccupiedCellDrop: true,
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this),
      rowHeightRatio: 1,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      { cols: 1, rows: 1, y: 0, x: 0 },
      { cols: 1, rows: 1, y: 1, x: 1 }
    ];
  }

  ngAfterViewInit() {
    if(this.options && this.options.api && this.options.api.optionsChanged) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  changedOptions(): void {
    if (this.options && this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellClick(event: MouseEvent, item: GridsterItem): void {
    console.info('empty cell click', event, item);
    this.dashboard.push(item);
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItem): void {
    $event.preventDefault();
    $event.stopPropagation();
    if(this.dashboard) {
      this.dashboard.splice(this.dashboard.indexOf(item), 1);
    }
  }

  addItem(): void {
    if(this.dashboard) {
      this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
    }
  }

  dragStartHandler(ev: DragEvent): void {
    if (ev.dataTransfer) {
      ev.dataTransfer.setData('text/plain', 'Drag Me Button');
      ev.dataTransfer.dropEffect = 'copy';
    }
  }
}