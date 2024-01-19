import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {map, Observable} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {UtilService} from "../services/util.service";

@Injectable({providedIn: 'root'})
export class CustomValidators {

  utilService = inject(UtilService);

  lettersOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // Modifica l'espressione regolare per escludere i numeri e consentire lettere, spazi, e alcuni caratteri speciali
      const hasForbiddenChars = /[^a-zA-Z ']/.test(control.value);
      const hasLeadingOrTrailingSpaces = /^\s|\s$/.test(control.value);

      if (hasForbiddenChars || hasLeadingOrTrailingSpaces) {
        return {'forbiddenCharacters': {value: control.value}};
      }
      return null;
    };
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.utilService.checkEmail(control.value).pipe(
        map(emailExists => {
          // Se l'email esiste, ritorna un errore
          return emailExists ? {emailExists: true} : null;
        })
      );
    };
  }


}
