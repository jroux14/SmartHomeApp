import {Component, ElementRef, ViewChild} from '@angular/core';
import {DisplayGrid, GridsterConfig, GridsterItem, GridType} from "angular-gridster2";
import {CommonComponent} from '../../common/common.component';
import {isEqual} from 'lodash'
import {shPanel} from "../../../../interfaces/panel.interface";
import {AddPanelPopup} from "../../popup/addpanel-popup/addpanel.popup";

@Component({
  selector: 'dragdrop-container',
  templateUrl: './dragdrop.container.html',
  styleUrls: ['./dragdrop.container.css'],
})
export class DragDropContainerComponent extends CommonComponent{
  @ViewChild("wrapper") elementRef!: ElementRef;

  private readonly COL_HYSTERESIS = 1;

  private originalLayout: Map<string, GridsterItem> = new Map();
  private hasReflowed = false;
  private lastCols: number | null = null;


  private resizeObserver: ResizeObserver | undefined;
  private resizeTimeout: any;
  private lastObservedWidth: number | null = null;
  private lastObservedHeight: number | null = null;
  private resizeInitialized = false;

  gridsterReady: boolean = false;
  viewReady: boolean = false;

  options: GridsterConfig = {};
  startingSize: any = {
    minCols: 0,
    minRows: 0,
    maxCols: 0,
    emptyCellDragMaxCols: 0,
    emptyCellDragMaxRows: 0
  }

  newPanel: shPanel | undefined;

  initSize(width: number, height: number) {
    this.startingSize.maxCols = Math.floor((width - 25 + 10) / (125 + 10));
    this.startingSize.minCols = Math.floor((width - 25 + 10) / (125 + 10));
    this.startingSize.minRows = Math.floor((height - 20 + 10) / (125 + 10));
  }

  override ngOnInit() {
    super.ngOnInit();

    this.initSize(window.innerWidth, window.innerHeight);

    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.None,
      setGridSize: false,
      margin: 10,
      outerMarginLeft: 15,
      swap: true,
      pushItems: false,
      enableEmptyCellDrop: true,
      enableOccupiedCellDrop: true,
      // rowHeightRatio: 1,
      mobileBreakpoint: 0,
      compactType: 'none',
      initCallback: () => {
        this.gridsterReady = true;
        this.tryStartResizeObserver();
      },
      maxCols: this.startingSize.maxCols,
      minCols: this.startingSize.minCols,
      minRows: this.startingSize.minRows,
      emptyCellDragMaxCols: this.startingSize.emptyCellDragMaxCols,
      emptyCellDragMaxRows: this.startingSize.emptyCellDragMaxRows,
      itemChangeCallback: (item: GridsterItem) => this.onItemChange(item),
      emptyCellClickCallback: this.emptyCellClick.bind(this),
      draggable: {
        enabled: true,
        dragHandleClass: 'drag-handler',
        ignoreContent: true
      },
      resizable: {
        enabled: false,
      },
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this)
    };

    this.addSubscription(this.dataService.newPanelEmitter.subscribe(resp => {
      this.popupService.closePopup();
      this.newPanel = resp;
      this.options.enableEmptyCellClick = true;
      this.options.displayGrid = DisplayGrid.Always;
      this.changedOptions();
    }));

    this.addSubscription(this.dataService.editModeEmitter.subscribe(resp => {
      if (this.options.resizable) {
        if (resp) {
          this.options.resizable.enabled = true;
          this.changedOptions();
        } else {
          this.options.resizable.enabled = false;
          this.changedOptions();
        }
      }
    }));
  }

  override ngAfterViewInit(): void {
    this.viewReady = true;

    this.authService.getDashboardPanels().forEach(panel => {
      if (panel.data && panel.data.item) {
        const clone = { ...panel.data.item };
        this.originalLayout.set(panel.panelId, clone); // use a unique panel id
      }
    });

    this.tryStartResizeObserver();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private markOccupied(x: number, y: number, w: number, h: number, map: Set<string>) {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        map.add(`${x + dx},${y + dy}`);
      }
    }
  }

  private isFree(x: number, y: number, w: number, h: number, map: Set<string>): boolean {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        if (map.has(`${x + dx},${y + dy}`)) return false;
      }
    }
    return true;
  }

  private tryStartResizeObserver(): void {
    if (!(this.gridsterReady && this.viewReady)) return;

    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(entries => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          for (let entry of entries) {
            const { width, height } = entry.contentRect;

            if (!this.resizeInitialized) {
              this.lastObservedWidth = width;
              this.lastObservedHeight = height;
              this.resizeInitialized = true;
              return;
            }

            if (width !== this.lastObservedWidth || height !== this.lastObservedHeight) {
              this.lastObservedWidth = width;
              this.lastObservedHeight = height;

              this.handleResize(width, height);
            }
          }
        }, 100);
      });
    }

    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  private handleResize(containerWidth: number, containerHeight: number): void {
    const itemSize = 125;
    const margin = 10;
    const outerMargin = 25;

    const newCols = Math.floor((containerWidth - outerMargin + margin) / (itemSize + margin));
    const newRows = Math.floor((containerHeight - 20 + margin) / (itemSize + margin));

    const panels = this.authService.getDashboardPanels();

    let isOverflowing = false;

    for (const panel of panels) {
      const item = panel?.data?.item;
      if (!item) continue;

      const effectiveCols = newCols - this.COL_HYSTERESIS; // shrink available space a bit

      if (item.x + item.cols > effectiveCols) {
        isOverflowing = true;
        break;
      }
    }

    if (isOverflowing) {
      this.reflowPanels(panels, newCols);
      this.hasReflowed = true;
    }

    if (!isOverflowing && this.hasReflowed && this.canRestoreLayout(newCols)) {
      this.restoreOriginalLayout(panels);
      this.hasReflowed = false;
    }


    if (this.options) {
      this.options.minCols = newCols;
      this.options.maxCols = newCols;
      this.options.minRows = newRows;

      setTimeout(() => {
        if (this.options.api) {
          this.options.api.optionsChanged?.();
          this.options.api.resize?.();
        }
      }, 0);
    }
  }

  private reflowPanels(panels: any[], newCols: number): void {
    const gridMap: Set<string> = new Set();

    panels.forEach((panel) => {
      const item = panel.data.item;
      const w = Math.min(item.cols || 1, newCols);
      const h = item.rows || 1;

      let placed = false;
      for (let y = 0; y < 100 && !placed; y++) {
        for (let x = 0; x <= newCols - w; x++) {
          if (this.isFree(x, y, w, h, gridMap)) {
            item.x = x;
            item.y = y;
            this.markOccupied(x, y, w, h, gridMap);
            placed = true;
            break;
          }
        }
      }

      if (!placed) {
        item.x = 0;
        item.y = 0;
      }

      item.cols = w;
      item.rows = h;
    });
  }

  private canRestoreLayout(newCols: number): boolean {
    for (const original of this.originalLayout.values()) {
      if ((original.x + original.cols) > newCols - this.COL_HYSTERESIS) {
        return false;
      }
    }
    return true;
  }

  private restoreOriginalLayout(panels: any[]): void {
    panels.forEach(panel => {
      const original = this.originalLayout.get(panel.panelId);
      if (original && panel.data?.item) {
        Object.assign(panel.data.item, original);
      }
    });
  }

  onItemChange(item: GridsterItem): void {
    this.authService.getDashboardPanels().forEach(panel => {
      if (panel.data && isEqual(panel.data.item, item)) {
        this.originalLayout.set(panel.panelId, { ...item });
        this.addSubscription(this.authService.updatePanelData(panel).subscribe());
      }
    })
  }

  changedOptions(): void {
    if(this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellClick(event: MouseEvent, item: GridsterItem): void {
    new Promise((resolve) => {
      setTimeout(() => {
        if(this.newPanel) {
          item.cols = 3;
          item.rows = 2;
          item.minItemRows = 2;
          item.maxItemRows = 2;
          item.minItemCols = 3;

          this.newPanel.data = {
            item: item,
            filterValue: ''
          };
          resolve("done");
        }
      }, 100);
    }).finally(() => {
      this.placeNewPanel();
    });
  }

  placeNewPanel() {
    if(this.newPanel) {
      this.authService.registerNewPanel(this.newPanel).subscribe(resp => {
        if (resp.success && this.newPanel) {
          this.newPanel.panelId = resp.panel.panelId;
          this.authService.addPanel(this.newPanel);
          this.options.enableEmptyCellClick = false;
          this.options.displayGrid = DisplayGrid.None;
          this.changedOptions();
        } else {
          if (resp.error) {
            let ref = this.openSnackBar(resp.error, "Try Again");
            this.popupService.resolvePopupSnackBar(ref, AddPanelPopup, { panelClass: 'baseDialog', disableClose: false });
          }
        }
      })
    } else {
      let ref = this.openSnackBar("Failed to add panel", "Try again");
      this.popupService.resolvePopupSnackBar(ref, AddPanelPopup, { panelClass: 'baseDialog', disableClose: false});
    }
  }

  trackByPanelId(index: number, panel: shPanel): string | undefined {
    return panel.panelId;
  }
}
