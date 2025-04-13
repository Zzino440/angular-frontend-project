import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  httpClient = inject(HttpClient);

  private environment = environment.endpointUri
  private usersUri = "users/"

  constructor() { }
}
