import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RegisterRequest} from "../models/register-request";
import {Observable} from "rxjs";
import {LoginRequest} from "../models/login-request";
import {User} from "../../features/user/models/user";
import {Permission} from "../../features/user/models/permission";
import {Role} from "../../features/user/models/role.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUserSignal = signal<User | undefined | null>(undefined);

  private environment = environment.endpointUri;
  private authUri = "auth/"

  constructor(private httpClient: HttpClient) {
  }

  registration(registerRequest: RegisterRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.environment}${this.authUri}register`, registerRequest)
  }

  authenticate(loginRequqest: LoginRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.environment}${this.authUri}authenticate`, loginRequqest)
  }

  isLoggedIn() {
    return this.currentUserSignal() !== undefined;
  }

  logout() {
    return this.currentUserSignal.set(undefined);
  }

  userHasAllAuthorities(permissions: Permission[]) {
    return permissions.every(permission => this.currentUserSignal()?.authorities.includes(permission));
  }

  userHasOneOfTheAuthorities(permissions: Permission[]) {
    return permissions.some(permission => this.currentUserSignal()?.authorities.includes(permission));
  }

  userHasOneOfTheRoles(roles: Role[]){
      return roles.some(role => this.currentUserSignal()?.role?.includes(role))
  }

  checkEmail(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.get<string>(`${this.environment}${this.authUri}check-email`, {params});
  }
}
