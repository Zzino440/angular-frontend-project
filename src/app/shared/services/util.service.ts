import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private environment = environment.endpointUri;
  httpClient = inject(HttpClient)

  constructor() {
  }

  checkEmail(email: string): Observable<String> {
    return this.httpClient.get<string>(`${this.environment}users/check-email?email=${email}`);
  }


}
