import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static lettersOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // Modifica l'espressione regolare per escludere i numeri e consentire lettere, spazi, e alcuni caratteri speciali
      const hasForbiddenChars = /[^a-zA-Z ']/.test(control.value);
      const hasLeadingOrTrailingSpaces = /^\s|\s$/.test(control.value);

      if (hasForbiddenChars || hasLeadingOrTrailingSpaces) {
        return { 'forbiddenCharacters': { value: control.value } };
      }
      return null;
    };
  }


}
