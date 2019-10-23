import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EloService } from '../elo.service';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.less']
})
export class CreateMatchComponent implements OnInit {
  red = "red";
  blue = "blue";

  teamRed: Object = null;
  teamRedName = "None";
  teamBlue: Object = null;
  teamBlueName = "None";

  status = "Select teams";

  constructor(private eloService: EloService) { }

  onSelectedTeam(event: Object) {
    console.log("Received event " + JSON.stringify(event));
    if (event) {
      let team = event['team'];
      if (event['label'] === this.red) {
        console.log("Assign team red to " + JSON.stringify(team));
        this.teamRed = team;
        this.teamRedName = team.id;
      } else {
        console.log("Assign team blue to " + JSON.stringify(team));
        this.teamBlue = team;
        this.teamBlueName = team.id;
      }
      if (this.teamRed && this.teamBlue) {
        console.log("Both teams assigned");
        this.status = "OK";
      }
    }
  }

  ngOnInit() {
  }

}
