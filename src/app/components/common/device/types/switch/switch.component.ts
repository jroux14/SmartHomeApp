import {Component, Input, SimpleChanges} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DragDropItemComponent } from '../../../dragdrop/dragdropitem/dragdrop.item';
import {isEqual} from "lodash";
import {shDevice} from "../../../../../interfaces/device.interface";

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
})
export class SwitchComponent extends DragDropItemComponent {

  @Input()
  device: shDevice | undefined;

  switchState: boolean = false;
  switchStateText: string = "";

  override ngOnInit(): void {
    super.ngOnInit();

    // dev switches won't ever fire a change so just call this to init text
    this.updateSwitchState();
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const deviceChange = changes['device'];

    if (deviceChange?.previousValue && deviceChange.currentValue) {
      const oldData = deviceChange.previousValue.data;
      const newData = deviceChange.currentValue.data;

      if (!isEqual(oldData, newData)) {
        this.updateSwitchState();
      }
    } else if (deviceChange?.currentValue?.data) {
      // First time initialization
      this.updateSwitchState();
    }
  }

  updateSwitchState(): void {
    const relay = this.device?.data?.switches?.switch_relay;
    this.switchState = relay === 'ON';
    this.switchStateText = this.switchState ? 'ON' : 'OFF';
  }

  onSlideToggleChange(event: MatSlideToggleChange) {
    if (this.device) {
      this.addSubscription(this.deviceService.toggleSwitch(this.device.deviceName).subscribe());
      this.switchStateText = this.switchState ? 'ON' : 'OFF';
    }
  }
}
