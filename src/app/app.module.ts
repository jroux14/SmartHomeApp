import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/components/app/app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { ButtonRoutingComponent } from './components/inputs/button-routing/button-routing.component';
import { ButtonSimpleComponent } from './components/inputs/button-simple/button-simple.component';
import { CommonComponent } from './components/components/common/common/common.component';
import { NavbarComponent } from './components/components/navbar/navbar.component';
import { DropdownComponent } from './components/components/dropdown/dropdown.component';
import { DragDropComponent } from './components/components/DragDrop/drag.drop';

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
    DragDropComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
