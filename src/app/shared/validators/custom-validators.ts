import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static lettersOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = /[^a-zA-Z ]/.test(control.value);
      return forbidden ? { 'forbiddenCharacters': { value: control.value } } : null;
    };
  }
}
