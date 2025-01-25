import {inject, Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CategoryForm} from "../models/categoryForm";
import {Category} from "../../../shared/models/category";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryFormService {

  fb = inject(FormBuilder)

  private editingRowIndexSubject = new BehaviorSubject<number | null>(null);
  public editingRowIndex$ = this.editingRowIndexSubject.asObservable();

  constructor() {
  }

  public createCategoryForm(category: Category): FormGroup<CategoryForm> {
    const categoryForm = this.fb.group<CategoryForm>({
      id: new FormControl<number>({value: category.id ?? null, disabled: true}),
      description: new FormControl<string>({value: category.description ?? '', disabled: true}),
      name: new FormControl<string>({value: category.name ?? '', disabled: true}),
      vocabularyId: new FormControl<number>({value: category.vocabularyId ?? null, disabled: true}),
      parentCategoryId: new FormControl<number>({value: category.parentCategoryId ?? null, disabled: true}),
      parentCategoryName: new FormControl<string>({value: category.parentCategoryName ?? null, disabled: true}),
    });
    return categoryForm;
  }

  setEditingRowIndex(index: number | null): void {
    this.editingRowIndexSubject.next(index);
  }

  getEditingRowIndex(): number | null {
    return this.editingRowIndexSubject.getValue();
  }

}
