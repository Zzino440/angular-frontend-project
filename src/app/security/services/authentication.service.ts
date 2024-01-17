import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RegisterRequest} from "../models/register-request";
import {Observable} from "rxjs";
import {LoginRequest} from "../models/login-request";
import {User} from "../../features/user/models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUserSignal = signal<User | undefined | null>(undefined)

  private environment = environment.endpointUri;

  constructor(private httpClient: HttpClient) {
  }

  registration(registerRequest: RegisterRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.environment}auth/register`, registerRequest)
  }

  authenticate(loginRequqest: LoginRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.environment}auth/authenticate`, loginRequqest)
  }
}
