import {APP_INITIALIZER, NgModule} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { GridsterModule } from 'angular-gridster2';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { StorageModule } from '@ngx-pwa/local-storage';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';

import { DataService } from './services/data.service';
import { PopupService } from './services/popup.service';
import { AuthenticationService } from './services/authentication.service'
import { DeviceService } from './services/device.service'

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { DevicesComponent } from "./components/pages/devices/devices.component";
import { SettingsComponent } from './components/pages/settings/settings.component';
import { CommonComponent } from './components/common/common/common.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DragDropContainerComponent } from './components/common/dragdrop/dragdropcontainer/dragdrop.container';
import { LoginPopupComponent } from './components/common/popup/login-popup/login-popup.component';
import { CommonInputComponent } from './components/inputs/common-input/common-input.component';
import { DevicePagePopup } from './components/common/popup/devicepage-popup/devicepage.popup';
import { AddPanelPopup } from "./components/common/popup/addpanel-popup/addpanel.popup";
import { DragDropItemComponent } from './components/common/dragdrop/dragdropitem/dragdrop.item';
import { SensorGraphComponent } from './components/sensorgraph/sensorgraph.component';
import { SwitchComponent } from './components/common/device/types/switch/switch.component';
import { SensorComponent } from './components/common/device/types/sensor/sensor.component';
import { ConfirmationSnackbarComponent } from './components/common/confirmationsnackbar/confirmationsnackbar.component'
import { DeviceComponent } from "./components/common/device/device.component";
import { PanelComponent } from "./components/common/panel/panel.component";
import { ScrollButtonsComponent } from "./components/common/scroll-btns/scroll-btns.component";
import { DeviceStatsPopup } from "./components/common/popup/devicestats-popup/devicestats.popup";

import { AuthInterceptor } from './utils/auth.interceptor';
import { AppInitializerService } from "./services/appinitializer.service";
import { MatRadioModule } from "@angular/material/radio";

export function appInitializerFactory(appInitService: AppInitializerService) {
  return () => appInitService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    HomeComponent,
    DevicesComponent,
    DeviceComponent,
    PanelComponent,
    SettingsComponent,
    NavbarComponent,
    DragDropContainerComponent,
    DragDropItemComponent,
    LoginPopupComponent,
    CommonInputComponent,
    DevicePagePopup,
    AddPanelPopup,
    SensorGraphComponent,
    SwitchComponent,
    SensorComponent,
    ConfirmationSnackbarComponent,
    ScrollButtonsComponent,
    DeviceStatsPopup
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule,
    GridsterModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatMenuModule,
    StorageModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatRadioModule
  ],
  providers: [
    DataService,
    AuthenticationService,
    PopupService,
    DeviceService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [AppInitializerService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
