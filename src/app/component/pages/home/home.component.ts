import { Component, OnInit } from '@angular/core';
import { EmitterService } from 'src/app/service/emitter/emitter.service';
import { CommunicationService } from 'src/app/service/communication/communication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  responseData: String = '';

  constructor(private communicationService: CommunicationService, private emitterService: EmitterService) { }

  ngOnInit(): void {
    this.emitterService.changeDetected.subscribe(resp => {
      this.testHttp();
    });
  }

  testHttp(): void {
    var env = this;
    this.communicationService.test().subscribe(data => {
      console.log(data.test);
      env.responseData = data.test;
    });
  }

}
