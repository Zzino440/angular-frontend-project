import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Category} from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  httpClient = inject(HttpClient);

  private environment = environment.endpointUri
  private categoryUri = "category/"
  private vocabularyUri = "vocabulary/"

  constructor() {
  }

  public getCategoriesByVocabularyId(vocabularyId: number) {
    return this.httpClient.get<Category[]>(`${this.environment + this.categoryUri + this.vocabularyUri}${vocabularyId}`);
  }

/*  public getCategorieById(categoryId: number) {
    return this.httpClient.get<Category[]>(`${this.environment + this.categoryUri}${categoryId}`);
  }*/


}
