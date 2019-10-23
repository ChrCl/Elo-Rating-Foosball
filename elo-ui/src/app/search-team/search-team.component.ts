import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

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

  @Input() label: string;
  @Output() selectedTeam = new EventEmitter<Object>();

  constructor(private eloService: EloService,
    private teamService: TeamService) { }

  onSelectedPlayer(event: Object) {
    let selectedTeam = this.selectedTeam;
    let status = this.status;
    let label = this.label;

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
        this.eloService.getTeam(this.players).subscribe({

          next(res) {
            if (res && Object.keys(res).length == 1) {
              let team = res[0];
              selectedTeam.emit({team: team, label: label});
            }
          },

          complete() {
            status = "OK";
          }

        });

      }
    }
  }

  alreadySelectedPlayers(): Object {
    return this.teamService.getPlayers();
  }

  ngOnInit() {
  }

}
