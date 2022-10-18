import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-simple',
  templateUrl: './button-simple.component.html',
  styleUrls: ['./button-simple.component.css']
})
export class ButtonSimpleComponent implements OnInit {
  @Input()
  bLabel: String = '';
  @Output()
  changeEmitter = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onChangeDetect(event: any) {
    this.changeEmitter.emit(event);
  }

}
