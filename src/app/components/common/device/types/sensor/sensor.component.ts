import { Component } from '@angular/core';
import { DragDropItemComponent } from '../../../dragdrop/dragdropitem/dragdrop.item';

@Component({
  selector: 'sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css'],
})
export class SensorComponent extends DragDropItemComponent {
  private differ = this.differs.find({}).create();

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
