import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, pipe } from 'rxjs';
import { catchError, map, tap, filter } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Match } from './match';

@Injectable({
  providedIn: 'root'
})
export class EloService {

  private djangoUrl = 'http://localhost:8000';  // URL to web api

  private httpOptions: any;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
      this.httpOptions = {
        headers: new HttpHeaders({
          // CORS allow requests from Angular to Django
          'x-requested-with':'*'
        })
      };
    }

  /** Log a EloService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`EloService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getPlayers(): Observable<Object> {
    const url = `${this.djangoUrl}/players/`;
    return this.http.get(url, this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched players')),
        catchError(this.handleError('getPlayers', []))
      );
  }

  getPlayer(id: number): Observable<Object> {
    const url = `${this.djangoUrl}/player/${id}/`;
    return this.http.get(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`fetched player id=${id}`)),
        catchError(this.handleError(`getPlayer id=${id}`,[]))
      );
  }

  searchPlayers(request: Object): Observable<Object> {
    let term = request['term'];
    let alreadySelected = request['alreadySelected'];
    if (!term.trim()) {
      return of([]);
    }

    const searchedTerm = term.trim().toLowerCase();
    // Get the observable player list from API
    const players = this.getPlayers();

    let isAlreadySelected = (player) => {
      if (alreadySelected) {
        for (let i in alreadySelected) {
          if (alreadySelected[i] && alreadySelected[i]['id'] == player['id']) {
            return true;
          }
        }
      }
      return false;
    }

    // Define the filtering function as an Observable consumer
    // The function takes the observable in args and MUST return
    // a function to unsubscribe the observable resources
    let filterPlayers = (observer) => {

      // On results
      players.subscribe({

        // Iterates over Observable result (in our case, a single Array object)
        next(res) {
          let result = [];
          for (let r in res) {
            let player = res[r];
            let name = player.name.trim().toLowerCase();
            if (name.includes(searchedTerm) && !isAlreadySelected(player)) {
              result.push(player);
            };
          }
          observer.next(result);
        },

        // When we reached the end of the observable
        complete() {
          observer.complete();
        }

      });

      // unsubscribe function doesn't need to do anything in this
      // because values are delivered synchronously
      return {unsubscribe() {}};
    }

    // Returns a new Observable from filtered results
    return new Observable(filterPlayers);
  }

  getTeam(players: Object[]): Observable<Object> {
    if (!players || players.length < 2) {
      return of([]);
    }
    let id1 = Math.max(players[0]['id'], players[1]['id']);
    let id2 = Math.min(players[0]['id'], players[1]['id']);
    let url = `${this.djangoUrl}/teams/?player1=${id1}&player2=${id2}`;
    console.log("Get team for players " + id1 + " and " + id2);
    return this.http.get(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`fetched team id1=${id1}, id2=${id2}`)),
        catchError(this.handleError(`getTeam id1=${id1}, id2=${id2}`,[]))
      );
  }

  // createMatch(match: Match) {
  //   const url = `${this.djangoUrl}/matches/`;
  //
  //   const data = {
  //     scoreRed: match.scoreRed,
  //     scoreBlue: match.scoreBlue,
  //     datetime: match.datetime,
  //     teamRed: ...,
  //     teamBlue: ...
  //   }
  //   return this.post(url, data, this.httpOptions)
  // }

}
