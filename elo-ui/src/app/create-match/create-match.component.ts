import { Component, OnInit, Inject } from '@angular/core';
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

  public date: Object = new Date();

  constructor(
    private eloService: EloService) { }

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

  onLoad(args: any) {

    /*Date need to be disabled*/
    let now = new Date();
    now.setHours(0,0,0,0);

    if (args.date.getDay() === 0 || args.date.getDay() === 6 || args.date.getTime() < now.getTime()) {
        args.isDisabled = true;
    }

  }

  ngOnInit() {
  }

}
