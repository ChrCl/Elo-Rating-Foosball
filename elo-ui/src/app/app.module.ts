import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMatchComponent } from './create-match/create-match.component';
import { ViewPlayerComponent } from './view-player/view-player.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateMatchComponent,
    ViewPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
