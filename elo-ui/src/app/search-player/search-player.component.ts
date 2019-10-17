import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { EloService } from '../elo.service';

@Component({
  selector: 'app-search-player',
  templateUrl: './search-player.component.html',
  styleUrls: ['./search-player.component.less']
})
export class SearchPlayerComponent implements OnInit {
  players$: Observable<Object>;
  player = new FormControl('');
  selectedPlayer = null;

  private searchTerms = new Subject<string>();

  constructor(private eloService: EloService) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectPlayer(player: Object): void {
    if (player['name']) {
      // Stores the player object
      this.player.setValue(player['name']);
      this.selectedPlayer = player;
      // remove suggestion list
      this.search('');
    }
  }

  ngOnInit() {
    this.players$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.eloService.searchPlayers(term)),
    );
  }

}
