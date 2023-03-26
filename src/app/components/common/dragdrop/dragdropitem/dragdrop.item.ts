import {Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {GridsterComponent, GridsterItemComponent} from 'angular-gridster2';
import { CommonComponent } from '../../common/common.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  imports: [NgForOf, GridsterComponent, GridsterItemComponent],
  selector: 'dragdrop-item',
  templateUrl: './drag.drop.html',
  styleUrls: ['./drag.drop.css'],
})
export class DragDropItemComponent extends CommonComponent{
  // list1 = ['Device 1', 'Device 2', 'Device 3'];

  // list2 = ['Device 4', 'Device 5', 'Device 6'];

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }
  // }
}
