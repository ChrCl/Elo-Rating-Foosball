import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMatchComponent } from './create-match/create-match.component';
import { ViewPlayerComponent } from './view-player/view-player.component';
import { ViewPlayersComponent } from './view-players/view-players.component';

const routes: Routes = [
  { path: 'create-match', component: CreateMatchComponent },
  { path: 'player/:id', component: ViewPlayerComponent },
  { path: 'players', component: ViewPlayersComponent },
  { path: '',
    redirectTo: '/create-match',
    pathMatch: 'full'
  },
  { path: '**', component: CreateMatchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
