import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }    from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMatchComponent } from './create-match/create-match.component';
import { SearchPlayerComponent } from './search-player/search-player.component';
import { ViewPlayerComponent } from './view-player/view-player.component';
import { ViewPlayersComponent } from './view-players/view-players.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateMatchComponent,
    SearchPlayerComponent,
    ViewPlayerComponent,
    ViewPlayersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
