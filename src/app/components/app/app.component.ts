import { Component } from '@angular/core';
import { CommonComponent } from '../common/common/common.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends CommonComponent {
  // title(title: any) {
  //   throw new Error('Method not implemented.');
  // }

  override ngOnInit() {
    super.ngOnInit();
  }
}
