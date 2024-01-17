import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RegisterRequest} from "../models/register-request";
import {Observable} from "rxjs";
import {LoginRequest} from "../models/login-request";
import {AuthResponse} from "../models/auth-response";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUserSignal = signal<AuthResponse | undefined | null>(undefined)

  private environment = environment.endpointUri;

  constructor(private httpClient: HttpClient) {
  }

  registration(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.environment}auth/register`, registerRequest)
  }

  authenticate(loginRequqest: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.environment}auth/authenticate`, loginRequqest)
  }
}
