import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {User} from "../models/user";
import {environment} from '../../../../environments/environment';
import {PagedResponse} from "../../../shared/models/paged-response";
import {SnackBarNotificationService} from "../../../shared/services/snack-bar-notification.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationTypeEnum} from "../../../shared/enums/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //injections
  snackBarNotificationService = inject(SnackBarNotificationService);
  snackBar = inject(MatSnackBar)

  private environment = environment.endpointUri
  private usersUri = "users/"

  constructor(private httpClient: HttpClient) {
  }

  getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.environment + this.usersUri}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getUserListExceptCurrent(id: number | undefined, email: string, page: number, size: number): Observable<PagedResponse<User>> {
    let params = new HttpParams()
      .set('currentUserId', id ? id : '')
      .set('userEmail', email ? email : '')
      .set('page', page)
      .set('size', size);

    return this.httpClient.get<any>(`${this.environment + this.usersUri}not-current`, {params})
      .pipe(
        catchError(error => this.handleError(error))
      );
  }


  createUser(user: User): Observable<Object> {
    return this.httpClient.post(`${this.environment + this.usersUri}`, user).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.environment + this.usersUri}${id}`).pipe(
      catchError(error => this.handleError(error))
    )
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.environment + this.usersUri}${id}`, user).pipe(
      catchError(error => this.handleError(error))
    )
  }

  deleteUser(id: number): Observable<Object> {
    return this.httpClient.delete<User>(`${this.environment + this.usersUri}${id}`).pipe(
      catchError(error => this.handleError(error))
    )
  }


  private handleError(error: HttpErrorResponse) {
    // Logica per gestire l'errore
    console.error('errore segnalato dal userService:', error.error);
    this.snackBarNotificationService.showError(error.error, 'OK', NotificationTypeEnum.ERROR)
    // Restituisce un Observable che emette l'errore
    return throwError(() => error);
  }
}
