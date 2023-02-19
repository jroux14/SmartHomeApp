import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { GridsterModule } from 'angular-gridster2';

import { AppComponent } from './components/components/app/app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { ButtonRoutingComponent } from './components/inputs/button-routing/button-routing.component';
import { ButtonSimpleComponent } from './components/inputs/button-simple/button-simple.component';
import { CommonComponent } from './components/components/common/common/common.component';
import { NavbarComponent } from './components/components/navbar/navbar.component';
import { DropdownComponent } from './components/components/common/dropdown/dropdown.component';
import { DragDropContainerComponent } from './components/components/common/dragdrop/dragdropcontainer/dragdrop.container';
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
    DragDropContainerComponent
    // DragDropItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule,
    GridsterModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
