import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Vocabulary} from "../models/vocabulary";

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {

  httpClient = inject(HttpClient);

  private environment = environment.endpointUri
  private vocabularyUri = "vocabulary/"

  constructor() {
  }

  public getAllVocabularies() {
    return this.httpClient.get<Vocabulary[]>(`${this.environment + this.vocabularyUri + 'getAll'}`);
  }
}
