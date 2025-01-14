import { NgModule } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { DataService } from './services/data.service';
import { PopupService } from './services/popup.service';
import { AuthenticationService } from './services/authentication.service'

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { CommonComponent } from './components/common/common/common.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DragDropContainerComponent } from './components/common/dragdrop/dragdropcontainer/dragdrop.container';
import { LoginPopupComponent } from './components/common/popup/login-popup/login-popup.component';
import { CommonInputComponent } from './components/inputs/common-input/common-input.component';
import { NewDevicePopupComponent } from './components/common/popup/newdevice-popup/newdevice-popup.component';
import { DragDropItemComponent } from './components/common/dragdrop/dragdropitem/dragdrop.item';
import { SensorGraphComponent } from './components/sensorgraph/sensorgraph.component';

import { AuthInterceptor } from './utils/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    HomeComponent,
    SettingsComponent,
    NavbarComponent,
    DragDropContainerComponent,
    DragDropItemComponent,
    LoginPopupComponent,
    CommonInputComponent,
    NewDevicePopupComponent,
    SensorGraphComponent
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
    MatMenuModule
  ],
  providers: [
    DataService,
    AuthenticationService,
    PopupService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
