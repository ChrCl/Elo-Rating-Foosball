import { Component, OnInit } from '@angular/core';

import { EloService } from '../elo.service';

@Component({
  selector: 'app-view-player',
  templateUrl: './view-player.component.html',
  styleUrls: ['./view-player.component.less']
})
export class ViewPlayerComponent implements OnInit {

  constructor(private eloService: EloService) { }

  ngOnInit() {
  }

}
