import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Validateur pour les caractères spéciaux
  static noSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = /[^a-zA-Z0-9\s]/.test(control.value); // Regex pour vérifier les caractères spéciaux
      return forbidden ? { 'specialCharacters': { value: control.value } } : null;
    };
  }
}
