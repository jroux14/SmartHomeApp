import {Component} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DragDropItemComponent } from '../../dragdrop.item';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
})
export class SwitchComponent extends DragDropItemComponent {
  private differ = this.differs.find({}).create();

  switchState: boolean = false;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  ngDoCheck(): void {
    if (this.device) {
      const changes = this.differ.diff(this.device.data);
      if (changes) {
        if (this.device.data.switches.switch_relay) {
          this.device.data.switches.switch_relay == "ON" ?  this.switchState = true : this.switchState = false;
        }
      }
    }
  }

  onSlideToggleChange(event: MatSlideToggleChange) {
    if (this.device) {
      this.deviceService.toggleSwitch(this.device.deviceName).subscribe();
    }
  }
}
