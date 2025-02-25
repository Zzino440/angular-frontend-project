import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  // Versione base: crea una nuova istanza e copia le proprietà
  mapFormValueToModel<T extends object>(formValue: any, model: new () => T): T {
    return Object.assign(new model(), formValue);
  }

  // Versione avanzata: aggiorna un'istanza esistente mantenendo proprietà non nel form
  updateModelWithFormValue<T extends object>(formValue: any, existingModel: T): T {
    return { ...existingModel, ...formValue };
  }

  // Versione con callback per manipolazioni specifiche
  mapFormValueToModelWithCallback<T extends object>(
    formValue: any,
    model: new () => T,
    callback?: (newModel: T) => void
  ): T {
    const newModel = Object.assign(new model(), formValue);
    if (callback) {
      callback(newModel);
    }
    return newModel;
  }
}
