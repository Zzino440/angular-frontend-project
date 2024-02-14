import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {User} from "../models/user";
import {environment} from '../../../../environments/environment';
import {PagedResponse} from "../../../shared/models/paged-response";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private environment = environment.endpointUri
  private usersUri = "users/"

  constructor(private httpClient: HttpClient) {
  }

  getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.environment + this.usersUri}`).pipe(
      catchError(this.handleError)
    );
  }

  getUserListExceptCurrent(id: number | undefined, email: string, page: number, size: number): Observable<PagedResponse<User>> {
    let params = new HttpParams()
      .set('currentUserId', id ? id : '')
      .set('userEmail', email ? email : '')
      .set('page', page)
      .set('size', size);

    return this.httpClient.get<any>(`${this.environment + this.usersUri}not-current`, {params})
      .pipe(catchError(this.handleError));
  }


  createUser(user: User): Observable<Object> {
    return this.httpClient.post(`${this.environment + this.usersUri}`, user).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.environment + this.usersUri}${id}`).pipe(
      catchError(this.handleError)
    )
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.environment + this.usersUri}${id}`, user).pipe(
      catchError(this.handleError)
    )
  }

  deleteUser(id: number): Observable<Object> {
    return this.httpClient.delete<User>(`${this.environment + this.usersUri}${id}`).pipe(
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
