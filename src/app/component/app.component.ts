import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../service/communication/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SmartHomeApp';

  constructor(private communicationService: CommunicationService) {}

  ngOnInit() {
    this.communicationService.test().subscribe(data => {
      console.log(data);
    });
  }
}
