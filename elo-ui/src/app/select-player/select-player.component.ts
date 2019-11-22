import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {EloService} from '../elo.service';

@Component({
  selector: 'app-select-player',
  templateUrl: './select-player.component.html',
  styleUrls: ['./select-player.component.less']
})
export class SelectPlayerComponent implements OnInit {

  constructor(private eloService: EloService) { }

  formControl = new FormControl();
  playerList;
  filterPlayerList: Observable<any>;

  ngOnInit() {

    this.playersList();

  }

  showPlayer(player): string | undefined {

    return player ? player.name : undefined;

  }

  private _filterPlayer(name: string) {

    const filterValue = name.toLowerCase();
    return this.playerList.filter(player =>
      player.name.toLowerCase().indexOf(filterValue) === 0
    );

  }

  playersList() {

    this.eloService.getPlayers()
      .subscribe(response => {

        this.playerList = response;

        this.filterPlayerList = this.formControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filterPlayer(name) : this.playerList.slice())

        );

      });

  }

}
