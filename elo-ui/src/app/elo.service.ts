import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EloService {

  private djangoUrl = 'http://localhost:8000/';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** Log a EloService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`EloService: ${message}`);
  }

  getPlayers(): Observable<Player[]> {
    return of(PLAYERS);
  }

}
