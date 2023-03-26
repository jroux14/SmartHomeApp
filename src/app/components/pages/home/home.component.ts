import { Component } from '@angular/core';
import { CommonComponent } from '../../common/common/common.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent extends CommonComponent {
  responseData: String = '';
  testLogin: boolean = true;

  override ngOnInit() {
    super.ngOnInit();
  }

  testHttp(): void {
    var env = this;
    this.addSubscription(this.dataService.test().subscribe(resp => {
      console.log(resp.test);
      env.responseData = resp.test;
    }));
  }
}
