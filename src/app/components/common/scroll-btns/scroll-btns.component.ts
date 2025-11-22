import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {CommonComponent} from "../common/common.component";

@Component({
  selector: 'scroll-btns',
  templateUrl: './scroll-btns.component.html',
  styleUrls: ['./scroll-btns.component.css']
})
export class ScrollButtonsComponent extends CommonComponent {

  @Input()
  scrollTarget!: HTMLElement;

  showScrollButtons: boolean = false;
  scrollAmount = 270;

  override ngOnInit() {
    super.ngOnInit();

    this.addSubscription(
      this.dataService.checkForOverflowEmitter.subscribe(resp => {
        this.checkForOverflow();
      })
    )
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    setTimeout(() => this.checkForOverflow());
    const resizeObserver = new ResizeObserver(() => {
      this.checkForOverflow();
    });
    resizeObserver.observe(this.scrollTarget);
  }

  checkForOverflow() {
    const el = this.scrollTarget;
    this.showScrollButtons = el.scrollWidth > el.clientWidth;
  }

  scrollLeft() {
    if (this.scrollTarget) {
      this.scrollTarget.scrollLeft -= this.scrollAmount;
    }
  }

  scrollRight() {
    if (this.scrollTarget) {
      this.scrollTarget.scrollLeft += this.scrollAmount;
    }
  }
}
