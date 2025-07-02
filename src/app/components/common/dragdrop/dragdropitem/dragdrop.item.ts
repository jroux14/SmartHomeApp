import {Component, Input} from '@angular/core';
import { CommonComponent } from '../../common/common.component';
import {shPanel} from "../../../../interfaces/panel.interface";

@Component({
  selector: 'dragdrop-item',
  templateUrl: './dragdrop.item.html',
  styleUrls: ['./dragdrop.item.css'],
})
export class DragDropItemComponent extends CommonComponent{
  @Input()
  panel: shPanel | undefined;

  override ngOnInit() {
    super.ngOnInit();
  }
}
