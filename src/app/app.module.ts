import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommunicationService } from './service/communication/communication.service';
import { EmitterService } from './service/emitter/emitter.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './component/app.component';
import { HomeComponent } from './component/pages/home/home.component';
import { SettingsComponent } from './component/pages/settings/settings.component';
import { ButtonRoutingComponent } from './component/common/button-routing/button-routing.component';
import { ButtonSimpleComponent } from './component/common/button-simple/button-simple.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    ButtonRoutingComponent,
    ButtonSimpleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    CommunicationService,
    EmitterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
