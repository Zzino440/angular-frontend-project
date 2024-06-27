import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RegisterRequest} from "../models/register-request";
import {catchError, lastValueFrom, Observable, throwError} from "rxjs";
import {LoginRequest} from "../models/login-request";
import {User} from "../../features/user/models/user";
import {Permission} from "../../features/user/models/permission";
import {Role} from "../../features/user/models/role.enum";
import {UserService} from "../../features/user/services/user.service";
import {Router} from "@angular/router";
import {SnackBarNotificationService} from "../../shared/services/snack-bar-notification.service";
import {NotificationTypeEnum} from "../../shared/enums/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userService = inject(UserService);
  router = inject(Router);
  snackBarNotificationService = inject(SnackBarNotificationService);

  currentUserSignal = signal<User | undefined | null>(undefined);

  private environment = environment.endpointUri;
  private authUri = "auth/"

  constructor(private httpClient: HttpClient) {
  }

  registration(registerRequest: RegisterRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.environment}${this.authUri}register`, registerRequest)
  }

  authenticate(loginRequqest: LoginRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.environment}${this.authUri}authenticate`, loginRequqest).pipe(
      catchError(err => this.handleError(err, 'authenticate'))
    )
  }

  isLoggedIn() {
    return this.currentUserSignal() !== undefined;
  }

  logout() {
    localStorage.clear();
    return this.currentUserSignal.set(undefined);
  }

  async isAuthenticated(): Promise<boolean> {
    const loggedUserId = this.currentUserId;
    const user: User = await lastValueFrom(this.userService.getUserById(loggedUserId));
    this.currentUserSignal.set(user);
    return this.isLoggedIn();
  }


  userHasAllAuthorities(permissions: Permission[]) {
    return permissions.every(permission => this.currentUserSignal()?.authorities.includes(permission));
  }

  userHasOneOfTheAuthorities(permissions: Permission[]) {
    return permissions.some(permission => this.currentUserSignal()?.authorities.includes(permission));
  }

  userHasOneOfTheRoles(roles: Role[]) {
    return roles.some(role => this.currentUserSignal()?.role?.includes(role))
  }

  checkEmail(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.get<string>(`${this.environment}${this.authUri}check-email`, {params});
  }

  //getters
  get currentUserId(): number {
    return Number(localStorage.getItem('userId'));
  }

  private handleError(error: HttpErrorResponse, methodName: string) {
    console.error(`errore segnalato da authenticationsService, metodo ${methodName}:`, error.error);
    this.snackBarNotificationService.notify(error.error, 'OK', NotificationTypeEnum.ERROR)
    return throwError(() => error);
  }

}
