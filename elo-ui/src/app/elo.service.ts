import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

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
    const url = `${this.djangoUrl}/players/?format=json`;
    return this.http.get(url, this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getPlayers', []))
      );
  }


}
