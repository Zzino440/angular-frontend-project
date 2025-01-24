import {Component, inject, OnInit} from '@angular/core';
import {VocabularyService} from "../../../../shared/services/vocabulary.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatActionList, MatListItem} from "@angular/material/list";
import {NgForOf} from "@angular/common";
import {Vocabulary} from "../../../../shared/models/vocabulary";
import {CategoryListComponent} from "../category-list/category-list.component";
import {CategoryService} from "../../../../shared/services/category.service";
import {Category} from "../../../../shared/models/category";

@Component({
  selector: 'app-vocabulary-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatListItem,
    NgForOf,
    MatActionList,
    CategoryListComponent,
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
    });
  }

  onVocabularySelected(vocabulary: Vocabulary) {
    this.selectedVocabulary = vocabulary;
    this.categoryService.getCategoriesByVocabularyId(vocabulary.id).subscribe(categories => {
      this.categories = categories;
    });
  }
}
