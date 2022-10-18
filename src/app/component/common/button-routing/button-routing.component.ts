import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'button-routing',
  templateUrl: './button-routing.component.html',
  styleUrls: ['./button-routing.component.css']
})
export class ButtonRoutingComponent implements OnInit {
  @Input()
  bLabel: String = 'Test';
  @Input()
  bLink: String = '';

  constructor() { }

  ngOnInit(): void {
  }

  getLink(): String {
    return this.bLink;
  }

}
