import { Component, OnInit } from '@angular/core';

import { EloService } from '../elo.service';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-search-team',
  templateUrl: './search-team.component.html',
  styleUrls: ['./search-team.component.less']
})
export class SearchTeamComponent implements OnInit {
  player1 = "Player 1";
  player2 = "Player 2";

  status = "Please select players";

  players: Object[] = [null, null];

  constructor(private eloService: EloService,
    private teamService: TeamService) { }

  onSelectedPlayer(event: Object) {
    console.log("Received event " + JSON.stringify(event));
    if (event) {
      let player = event['player'];
      if (event['label'] === this.player1) {
        this.teamService.removePlayer(this.players[0]);
        this.players[0] = player;
      } else {
        this.teamService.removePlayer(this.players[1]);
        this.players[1] = player;
      }
      this.teamService.addPlayer(player);
      if (this.players[0] && this.players[1]) {
        this.status = "OK";
      }
    }
  }

  alreadySelectedPlayers(): Object {
    return this.teamService.getPlayers();
  }

  ngOnInit() {
  }

}
