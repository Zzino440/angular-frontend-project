import {FormArray, FormControl, FormGroup} from "@angular/forms";

export interface CategoryForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  // vocabularyId: FormControl<number>;
  // vocabularyName: FormControl<string>;
  parentCategoryId: FormControl<number | null>;
  parentCategoryName: FormControl<string | null>;
  // subCategories: FormArray<FormGroup<SubCategoryForm>>;

}

export interface SubCategoryForm {
  id: FormControl<number>;
  name: FormControl<string>;
}
