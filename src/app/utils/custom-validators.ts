import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Validateur pour les caractères spéciaux
  static noSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Regex pour vérifier les caractères spéciaux, y compris ceux utilisés dans les scripts
      const forbidden = /[<>`!@#$%^&*()_+=[\]{};:"\\|,.<>/?~]/.test(control.value);
      return forbidden ? { 'specialCharacters': { value: control.value } } : null;
    };
  }
}
