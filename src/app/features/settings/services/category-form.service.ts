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
      id: new FormControl<number>({value: category.id ?? 0, disabled: true}),
      description: new FormControl<string>({value: category.description ?? '', disabled: true}),
      name: new FormControl<string>({value: category.name ?? '', disabled: true}),
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
