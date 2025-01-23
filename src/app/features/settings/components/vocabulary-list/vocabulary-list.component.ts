import {Component, inject, OnInit} from '@angular/core';
import {VocabularyService} from "../../../../shared/services/vocabulary.service";

@Component({
  selector: 'app-vocabulary-list',
  standalone: true,
  imports: [],
  templateUrl: './vocabulary-list.component.html',
  styleUrl: './vocabulary-list.component.scss'
})
export class VocabularyListComponent implements OnInit {

  vocabularyService = inject(VocabularyService);

  constructor() {
  }

  ngOnInit(): void {
    this.getAllVocabularies();
  }

  getAllVocabularies() {
    this.vocabularyService.getAllVocabularies().subscribe(vocabularies => {
      console.log(vocabularies);
    });
  }

}
