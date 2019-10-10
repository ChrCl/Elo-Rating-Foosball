import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { EloService } from '../elo.service';

@Component({
  selector: 'app-view-player',
  templateUrl: './view-player.component.html',
  styleUrls: ['./view-player.component.less']
})
export class ViewPlayerComponent implements OnInit {
  player: Object;

  constructor(
    private route: ActivatedRoute,
    private eloService: EloService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getPlayer();
  }

  getPlayer() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.eloService.getPlayer(id)
      .subscribe(player => this.player = player);
  }

  goBack() {
    this.location.back();
  }

}
