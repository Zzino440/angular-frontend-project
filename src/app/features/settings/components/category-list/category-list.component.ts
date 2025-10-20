import {Component, inject, Input, OnInit} from '@angular/core';
import {Category} from "../../../../shared/models/category";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {Vocabulary} from "../../../../shared/models/vocabulary";
import { AsyncPipe } from "@angular/common";
import {CategoryForm} from "../../models/categoryForm";
import {CategoryFormService} from "../../services/category-form.service";
import {FormArray, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {BehaviorSubject} from "rxjs";
import {MatOption, MatSelect} from "@angular/material/select";
import {CategoryService} from "../../../../shared/services/category.service";
import {VocabulariesEnum} from "../../../../shared/enums/vocabularies.enum";

@Component({
    selector: 'app-category-list',
    imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatIcon,
    AsyncPipe,
    MatSelect,
    MatOption
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
  categoryService = inject(CategoryService);
  //FORM VARS
  categoryFormArray: FormArray<FormGroup<CategoryForm>> = new FormArray<FormGroup<CategoryForm>>([]);

  legalEntities: Category[] = [];

  constructor() {
    this.categories$.subscribe(categories => {
      this.populateCategoryFormArray(categories);

      if (this.selectedVocabulary?.id === VocabulariesEnum.BUSINESS_UNIT) {
        this.categoryService.getCategoriesByVocabularyId(VocabulariesEnum.LEGAL_ENTITY).subscribe(categories => {
          this.legalEntities = categories;
        })
      }
    });
  }

  ngOnInit(): void {
    if (this.selectedVocabulary) {
      this.fetchCategories();
    }
  }

  deleteCategory(i: number) {

  }

  fetchCategories() {
    this.categoryService.getCategoriesByVocabularyId(this.selectedVocabulary?.id).subscribe({
      next: (categories) => {
        this.categoriesSubject.next(categories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }


  addNewCategoryForm() {
    const newCategoryForm = this.categoryFormService.createCategoryForm(new Category());
    newCategoryForm.enable();
    this.categoryFormArray.push(newCategoryForm);
    this.enableCategoryFormGroupAtIndex(this.categoryFormArray.length - 1);
  }

  saveUpdateCategory(i: number) {
    let category = this.categoryFormArray.at(i).value as Category;
    category.vocabularyId = this.selectedVocabulary.id
    this.categoryService.saveUpdateCategory(category).subscribe({
      next: (updatedCategory) => {
        console.log('updatedCategory: ', updatedCategory)
      },
      error: (error) => {
        console.log('error in updating a category:', error)
      },
      complete: () => {
        this.categoryFormArray.at(i).disable();
        this.categoryFormService.setEditingRowIndex(null);
        this.fetchCategories()
      }
    })
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

  protected readonly VocabulariesEnum = VocabulariesEnum;
}
