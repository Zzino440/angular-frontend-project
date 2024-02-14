import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private environment = environment.endpointUri;
  httpClient = inject(HttpClient)

  constructor() {
  }




}
