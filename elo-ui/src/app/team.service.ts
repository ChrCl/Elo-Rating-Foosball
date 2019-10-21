import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  selectedPlayers: Object[] = [];

  constructor() { }

  addPlayer(player: Object): void {
    if (player) {
      this.selectedPlayers.push(player);
    }
  }

  removePlayer(player: Object): void {
    if (player) {
      const index = this.selectedPlayers.indexOf(player, 0);
      if (index >= 0) {
        this.selectedPlayers.splice(index, 1);
      }
    }
  }

  clearPlayers(): void {
    this.selectedPlayers = [];
  }

  getPlayers(): Object[] {
    return this.selectedPlayers;
  }

}
