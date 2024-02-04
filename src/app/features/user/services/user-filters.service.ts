import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from '../../../../environments/environment';
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserFiltersService {

  private environment = environment.endpointUri;
  private usersUri = 'users'
  private usersByEmailUri = '/searchByEmail'

  constructor(private httpClient: HttpClient) {
  }

  getUsersByEmail(email: string) {
    let params = new HttpParams().set('email', email)
    return this.httpClient.get<string[]>(`${this.environment + this.usersUri + this.usersByEmailUri}`, {params}).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    // Logica per gestire l'errore
    console.error('errore segnalato dal userService:', error.error);

    // Restituisce un Observable che emette l'errore
    return throwError(() => error);
  }
}
