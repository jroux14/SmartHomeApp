import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { GridsterModule } from 'angular-gridster2';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { ButtonRoutingComponent } from './components/inputs/button-routing/button-routing.component';
import { ButtonSimpleComponent } from './components/inputs/button-simple/button-simple.component';
import { CommonComponent } from './components/common/common/common.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DropdownComponent } from './components/common/dropdown/dropdown.component';
import { DragDropContainerComponent } from './components/common/dragdrop/dragdropcontainer/dragdrop.container';
import { LoginPopupComponent } from './components/common/popup/login-popup/login-popup.component';
import { TextInputComponent } from './components/inputs/text-input/text-input.component';
import { CommonInputComponent } from './components/inputs/common-input/common-input.component';
import { NewUserPopupComponent } from './components/common/popup/newuser-popup/newuser-popup.component';
{ NewUserPopupComponent}
// import { DragDropItemComponent } from './components/components/common/dragdrop/dragdropitem/dragdrop.item';

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    HomeComponent,
    SettingsComponent,
    ButtonRoutingComponent,
    ButtonSimpleComponent,
    NavbarComponent,
    DropdownComponent,
    DragDropContainerComponent,
    // DragDropItemComponent
    LoginPopupComponent,
    TextInputComponent,
    CommonInputComponent,
    NewUserPopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule,
    GridsterModule,
    MatDialogModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
