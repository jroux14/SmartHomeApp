import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../../common/common.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CommonComponent {
  responseData: String = '';

  override ngOnInit() {
    super.ngOnInit();
    this.addSubscription(this.dataService.changeDetected.subscribe(resp => {
      this.testHttp();
    }));
  }

  testHttp(): void {
    var env = this;
    this.addSubscription(this.dataService.test().subscribe(resp => {
      console.log(resp.test);
      env.responseData = resp.test;
    }));
  }

  

}