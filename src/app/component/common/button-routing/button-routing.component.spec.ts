import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonRoutingComponent } from './button-routing.component';

describe('ButtonComponent', () => {
  let component: ButtonRoutingComponent;
  let fixture: ComponentFixture<ButtonRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonRoutingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
