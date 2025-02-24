import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators} from "../../../shared/validators/custom-validators";
import {User, UserForm} from "../models/user";
import {Role} from "../models/role.enum";

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  private formBuilder = inject(FormBuilder);
  private customValidators = inject(CustomValidators);

  constructor() {

  }

  createUserForm(user?: User){
    const form = this.formBuilder.nonNullable.group<UserForm>({
      firstName: new FormControl({value: '', disabled: false}, {
        validators: [Validators.required, this.customValidators.lettersOnlyValidator],
        nonNullable: true
      }),
      lastName: new FormControl({value: '', disabled: false}, {
        validators: [Validators.required, this.customValidators.lettersOnlyValidator],
        nonNullable: true
      }),
      email: new FormControl({value: '', disabled: false}, {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.customValidators.emailExistsValidator()],
        updateOn: 'blur',
        nonNullable: true
      }),
      password: new FormControl({value: '', disabled: false}, {
        validators: [Validators.required],
        nonNullable: true
      }),
      role: new FormControl({value: '', disabled: false}, {
        validators: [Validators.required],
        nonNullable: true
      })
    });

    if (user) {
      form.patchValue(user);
    }

    return form;
  }

  setupEditMode(form: FormGroup<UserForm>): void {
    // Quando si è in modalità edit, rimuoviamo alcuni validatori
    const passwordControl = form.controls.password;
    const emailControl = form.controls.email;

    if (passwordControl) {
      passwordControl.clearValidators();
      passwordControl.updateValueAndValidity();
    }

    if (emailControl) {
      emailControl.clearAsyncValidators();
      emailControl.updateValueAndValidity();
    }
  }

  resetForm(form: FormGroup, user: User): void {
    form.reset(user);
  }
}
