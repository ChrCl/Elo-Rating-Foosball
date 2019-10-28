import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
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

  @Input() label: string;
  @Input() alreadySelected: Object[];
  @Output() selectedPlayer = new EventEmitter<Object>();

  private searchTerms = new Subject<Object>();

  constructor(private eloService: EloService) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next({term: term, alreadySelected: this.alreadySelected});
    if (term.trim() === '') {
      this.selectedPlayer.emit({player: null, label: this.label});
    }
  }

  // A player directly selected in the list
  selectPlayer(player: Object): void {
    if (player['name']) {
      // Stores the player object
      this.player.setValue(player['name']);
      this.selectedPlayer.emit({player: player, label: this.label});
      // remove suggestion list
      this.searchTerms.next({term: '', alreadySelected: this.alreadySelected});
    }
  }

  // Tests if the player suggestion is the current selected player
  isSelected(player: Object): boolean {
    if (player && this.player) {
      return player['name'].toLowerCase() === this.player.value.toLowerCase();
    }
    return false;
  }

  // Down arrow key pressed, choose next player
  selectNext(): void {
    console.log("Next " + this.label);
  }

  // Up arrow key pressed, choose previous player
  selectPrevious(): void {
    console.log("Previous " + this.label);
  }

  // Enter key pressed, validated selection
  select(): void {
    console.log("Select " + this.label);
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
