import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from '../../../../environments/environment';
import {catchError, throwError} from "rxjs";
import {NotificationTypeEnum} from "../../../shared/enums/notification-type.enum";
import {SnackBarNotificationService} from "../../../shared/services/snack-bar-notification.service";

@Injectable({
  providedIn: 'root'
})
export class UserFiltersService {

  snackBarNotificationService = inject(SnackBarNotificationService);

  private environment = environment.endpointUri;
  private usersUri = 'users'
  private usersByEmailUri = '/searchByEmail'

  constructor(private httpClient: HttpClient) {
  }

  getUsersByEmail(email: string) {
    let params = new HttpParams().set('email', email)
    return this.httpClient.get<string[]>(`${this.environment + this.usersUri + this.usersByEmailUri}`, {params}).pipe(
      catchError(error => this.handleError(error))
    )
  }

  private handleError(error: HttpErrorResponse) {
    // Logica per gestire l'errore
    console.error('errore segnalato dal userService:', error.error);
    this.snackBarNotificationService.notify(error.error, 'OK', NotificationTypeEnum.ERROR)
    // Restituisce un Observable che emette l'errore
    return throwError(() => error);
  }
}
