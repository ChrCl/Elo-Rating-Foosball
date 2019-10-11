import { Component, OnInit } from '@angular/core';

import { EloService } from '../elo.service';

@Component({
  selector: 'app-view-players',
  templateUrl: './view-players.component.html',
  styleUrls: ['./view-players.component.less']
})
export class ViewPlayersComponent implements OnInit {
  players: Object;

  constructor(
    private eloService: EloService) { }

  ngOnInit() {
    this.getPlayers();
  }

  getPlayers() {
    this.eloService.getPlayers()
      .subscribe(players => this.players = players);
  }

}
