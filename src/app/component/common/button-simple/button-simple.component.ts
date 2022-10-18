import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmitterService } from 'src/app/service/emitter/emitter.service';

@Component({
  selector: 'button-simple',
  templateUrl: './button-simple.component.html',
  styleUrls: ['./button-simple.component.css']
})
export class ButtonSimpleComponent implements OnInit {
  @Input()
  bLabel: String = '';
  @Output()
  changeEmitter = new EventEmitter<any>();

  constructor(private emitterService:EmitterService) { }

  ngOnInit(): void {
  }

  onChangeDetect(event: any) {
    this.emitterService.changeDetected.emit(event);
  }

}
