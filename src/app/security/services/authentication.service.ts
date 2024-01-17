import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RegisterRequest} from "../models/register-request";
import {Observable} from "rxjs";
import {RegisterResponse} from "../models/register-response";
import {LoginRequest} from "../models/login-request";
import {LoginResponse} from "../models/login-response";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private environment = environment.endpointUri;

  constructor(private httpClient: HttpClient) {
  }

  registration(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.environment}auth/register`, registerRequest)
  }

  authenticate(loginRequqest: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.environment}auth/authenticate`, loginRequqest)
  }
}
