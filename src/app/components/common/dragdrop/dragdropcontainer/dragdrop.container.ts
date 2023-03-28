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
  options: GridsterConfig | undefined;
  dashboard: GridsterItem[] | undefined;
  startingSize: any = {
    minCols: 0,
    maxCols: 0,
    emptyCellDragMaxCols: 0,
    emptyCellDragMaxRows: 0
  }

  initSize(width: number) {
    this.startingSize.minCols = (width - 800) / 250;
    this.startingSize.maxCols = (width - 800) / 250;
    if (this.startingSize.minCols < 5) {
      this.startingSize.minCols = (width - 500) / 250;
      this.startingSize.maxCols = (width - 500) / 250;
      this.startingSize.emptyCellDragMaxCols = (width - 500) / 250;
      this.startingSize.emptyCellDragMaxRows = (width - 500) / 250;
    }
  }

  initDash() {
    if (this.dashboard) {
      for (let i = 0; i < this.dashboard.length; i++) {
        if (this.dashboard[i].x > this.startingSize.maxCols) {
          this.dashboard[i].x = this.startingSize.maxCols - 1;
        }
      }
    }
  }
  
  @HostListener('window:resize', ['$event'])
  sizeChange(event: any) {
    if(this.options) {
      if (event.target.innerWidth && event.target.innerHeight && this.options.api && this.options.api.optionsChanged && this.options.fixedColWidth) {
        this.options.minCols = (event.target.innerWidth - 800) / this.options.fixedColWidth;
        this.options.maxCols = (event.target.innerWidth - 800) / this.options.fixedColWidth;
        if (this.options.minCols < 5) {
          this.options.minCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
          this.options.maxCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
          this.options.emptyCellDragMaxCols = (event.target.innerWidth - 500) / this.options.fixedColWidth;
          this.options.emptyCellDragMaxRows = (event.target.innerWidth - 500) / this.options.fixedColWidth;
        }
        if (this.dashboard) {
          for (let i = 0; i < this.dashboard.length; i++) {
            if (this.dashboard[i].x > this.options.maxCols) {
              this.dashboard[i].x = this.options.maxCols - 1;
            }
          }
        }

        this.changedOptions();
        this.options.api.resize!();
      }
    }
  }

  override ngOnInit() {
    super.ngOnInit();
    this.initSize(window.innerWidth);
    this.options = {
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.None,
      setGridSize: true,
      fixedColWidth: 250,
      fixedRowHeight: 250,
      margin:30,
      outerMarginLeft: 250,
      outerMarginTop: 50,
      swap: true,
      pushItems: false,
      enableEmptyCellDrop: true,
      enableOccupiedCellDrop: true,
      rowHeightRatio: 1,
      maxCols: this.startingSize.maxCols,
      minCols: this.startingSize.minCols,
      emptyCellDragMaxCols: this.startingSize.emptyCellDragMaxCols,
      emptyCellDragMaxRows: this.startingSize.emptyCellDragMaxRows,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this)
    };

    this.dashboard = [
      { cols: 1, rows: 1, y: 0, x: 0 },
      { cols: 1, rows: 1, y: 1, x: 1 }
    ];

    this.initDash();
  }

  changedOptions(): void {
    if (this.options && this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellClick(event: MouseEvent, item: GridsterItem): void {
    console.info('empty cell click', event, item);
    if(this.dashboard) {
      this.dashboard.push(item);
    }
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
