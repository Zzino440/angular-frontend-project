import {Component, inject, OnInit} from '@angular/core';
import {VocabularyService} from "../../../../shared/services/vocabulary.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatActionList, MatListItem} from "@angular/material/list";

import {Vocabulary} from "../../../../shared/models/vocabulary";
import {CategoryListComponent} from "../category-list/category-list.component";
import {CategoryService} from "../../../../shared/services/category.service";
import {Category} from "../../../../shared/models/category";

@Component({
    selector: 'app-vocabulary-list',
    imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatListItem,
    MatActionList,
    CategoryListComponent
],
    templateUrl: './vocabulary-list.component.html',
    styleUrl: './vocabulary-list.component.scss'
})
export class VocabularyListComponent implements OnInit {

  vocabularyService = inject(VocabularyService);
  categoryService = inject(CategoryService);

  vocabularies: Vocabulary[] = [];
  categories: Category[] = [];

  selectedVocabulary!: Vocabulary;

  constructor() {
  }

  ngOnInit(): void {
    this.getAllVocabularies();
  }

  getAllVocabularies() {
    this.vocabularyService.getAllVocabularies().subscribe(vocabularies => {
      this.vocabularies = vocabularies;

      // Pre-seleziona il vocabolario "Legal Entity" con id = 2
      const defaultVocabulary = vocabularies.find(v => v.id === 2);
      if (defaultVocabulary) {
        this.onVocabularySelected(defaultVocabulary);
        this.selectedVocabulary = defaultVocabulary;
      }
    });
  }


  onVocabularySelected(vocabulary: Vocabulary) {
    this.selectedVocabulary = vocabulary;
    this.categoryService.getCategoriesByVocabularyId(vocabulary.id).subscribe(categories => {
      this.categories = categories;
        console.log('this.categories:   ', this.categories)
    });
  }
}
