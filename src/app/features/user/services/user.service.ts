import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {UserModel} from "../models/user.model";
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private environment = environment.endpointUri

  constructor(private httpClient: HttpClient) {
  }

  getUserList(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${this.environment}users`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: UserModel): Observable<Object> {
    return this.httpClient.post(`${this.environment}users`, user).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${this.environment}users/${id}`).pipe(
      catchError(this.handleError)
    )
  }

  updateUser(id: number, employee: UserModel): Observable<UserModel> {
    return this.httpClient.put<UserModel>(`${this.environment}users/${id}`, employee).pipe(
      catchError(this.handleError)
    )
  }

  deleteUser(id: number): Observable<Object> {
    return this.httpClient.delete<UserModel>(`${this.environment}users/${id}`).pipe(
      catchError(this.handleError)
    )
  }


  private handleError(error: HttpErrorResponse) {
    // Logica per gestire l'errore
    console.error('An error occured:', error.error);

    // Restituisce un Observable che emette l'errore
    return throwError(() => error);
  }
}
