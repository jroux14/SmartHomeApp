import {Component, inject, Input, KeyValueDiffers} from '@angular/core';
import { DragDropItemComponent } from '../../../dragdrop/dragdropitem/dragdrop.item';
import {shDevice} from "../../../../../interfaces/device.interface";

@Component({
  selector: 'sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css'],
})
export class SensorComponent extends DragDropItemComponent {
  protected diffUtil = inject(KeyValueDiffers);

  @Input()
  device: shDevice | undefined;

  private differ = this.diffUtil.find({}).create();

  override ngOnInit(): void {
    super.ngOnInit();
  }

  ngDoCheck(): void {
    if (this.device) {
      const changes = this.differ.diff(this.device.data);
      if (changes) {
        console.log(changes);
      }
    }
  }
}
