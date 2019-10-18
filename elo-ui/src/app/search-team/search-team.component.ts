import { Component, OnInit } from '@angular/core';

import { EloService } from '../elo.service';

@Component({
  selector: 'app-search-team',
  templateUrl: './search-team.component.html',
  styleUrls: ['./search-team.component.less']
})
export class SearchTeamComponent implements OnInit {
  player1 = "Player 1";
  player2 = "Player 2";

  constructor(private eloService: EloService) { }



  ngOnInit() {
  }

}
