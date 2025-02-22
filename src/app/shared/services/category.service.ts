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

  public saveUpdateCategory(category: Category) {
    if (category.id) {
      // Aggiornamento (ID presente)
      return this.httpClient.patch<Category>(
        `${this.environment + this.categoryUri}${category.id}`,
        category
      );
    } else {
      // Creazione (no ID)
      return this.httpClient.post<Category>(
        `${this.environment + this.categoryUri}`,
        category
      );
    }
  }


  /*  public getCategorieById(categoryId: number) {
      return this.httpClient.get<Category[]>(`${this.environment + this.categoryUri}${categoryId}`);
    }*/


}
