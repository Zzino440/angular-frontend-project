import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Category} from "../../../../shared/models/category";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {Vocabulary} from "../../../../shared/models/vocabulary";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {CategoryForm} from "../../models/categoryForm";
import {CategoryFormService} from "../../services/category-form.service";
import {FormArray, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    NgForOf,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatIcon,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {

  //RJXS SUBJECTS AND OBSERVABLES - FOR STATE MANAGEMENT
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  @Input() set categories(value: Category[]) {
    this.categoriesSubject.next(value); // Aggiorna i dati quando l'input cambia
  }
  @Input() selectedVocabulary!: Vocabulary;

  //INJECTIONS
  categoryFormService = inject(CategoryFormService);
  //FORM VARS
  categoryFormArray: FormArray<FormGroup<CategoryForm>> = new FormArray<FormGroup<CategoryForm>>([]);

  constructor() {
    this.categories$.subscribe(categories => {
      this.populateCategoryFormArray(categories);
    });
  }

  ngOnInit(): void {
  }

  //popolo il form array coi dati delle categories
  populateCategoryFormArray(categories: Category[]) {
    this.categoryFormArray.clear();
    categories.forEach(category => {
      const categoryForm = this.categoryFormService.createCategoryForm(category);
      this.categoryFormArray.push(categoryForm);
    });
  }

  enableCategoryFormGroupAtIndex(index: number) {
    this.categoryFormService.setEditingRowIndex(index);

    const selectedGroup = this.categoryFormArray.at(index);

    this.categoryFormArray.controls.forEach((group, i) => {
      if (i !== index) {
        group.disable();
      } else {
        group.enable();
      }
    });

  }

  undoEdit() {
    const editingIndex = this.categoryFormService.getEditingRowIndex();

    if (editingIndex !== null) {
      this.categoryFormArray.at(editingIndex).disable();
      this.categoryFormService.setEditingRowIndex(null);
    }

  }
}
