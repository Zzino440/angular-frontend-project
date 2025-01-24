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
export class CategoryListComponent implements OnInit, OnChanges {

  categoryFormService = inject(CategoryFormService);

  @Input() categories: Category[] = [];
  @Input() selectedVocabulary!: Vocabulary;

  categoryFormArray!: FormArray<FormGroup<CategoryForm>>;

  constructor() {
  }

  ngOnInit(): void {
    this.categoryFormArray = new FormArray<FormGroup<CategoryForm>>([]);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.populateCategoryFormArray();
  }

  //popolo il form array coi dati delle categories
  populateCategoryFormArray() {
    this.categoryFormArray?.clear();
    this.categories.forEach(category => {
      const categoryForm = this.categoryFormService.createCategoryForm(category);
      this.categoryFormArray?.push(categoryForm)
    })
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
