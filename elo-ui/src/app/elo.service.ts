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

  searchPlayers(term: string): Observable<Object> {
    if (!term.trim()) {
      return of([]);
    }

    const searchedTerm = term.trim().toLowerCase();
    // Get the observable player list from API
    const players = this.getPlayers();

    // Define the filtering function as an Observable consumer
    // The function takes the observable in args and MUST return
    // a function to unsubscribe the observable resources
    let filterPlayers = function(observer) {

      // On results
      players.subscribe({

        // Iterates over Observable result (in our case, a single Array object)
        next(res) {
          let result = [];
          for (let r in res) {
            let player = res[r];
            let name = player.name.trim().toLowerCase();
            if (name.includes(searchedTerm)) {
              console.log(name);
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

  // getTeam(player1: string, player2: string): Observable<Object> {
  //   const url = `${this.djangoUrl}/player/${id}/`;
  // }

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
