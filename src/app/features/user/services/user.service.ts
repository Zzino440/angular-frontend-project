import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {User} from "../models/user";
import {environment} from '../../../../environments/environment';
import {PagedResponse} from "../../../shared/models/paged-response";
import {SnackBarNotificationService} from "../../../shared/services/snack-bar-notification.service";
import {NotificationTypeEnum} from "../../../shared/enums/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //injections
  snackBarNotificationService = inject(SnackBarNotificationService);

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
    const params = new HttpParams()
      .set('currentUserId', id || '')
      .set('userEmail', email || '')
      .set('page', page)
      .set('size', size);

    return this.httpClient.get<PagedResponse<User>>(`${this.environment + this.usersUri}not-current`, {params})
      .pipe(catchError(this.handleError));
  }


  createUser(user: Partial<User>) {
    return this.httpClient.post<User>(`${this.environment + this.usersUri}`, user).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number) {
    return this.httpClient.get<User>(`${this.environment + this.usersUri}${id}`).pipe(
      catchError(this.handleError)
    )
  }

  updateUser(id: number, user: Partial<User>){
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
    console.error('errore segnalato da userService:', error.error);
    this.snackBarNotificationService.notify(error.error, 'OK', NotificationTypeEnum.ERROR)
    // Restituisce un Observable che emette l'errore
    return throwError(() => error);
  }
}
