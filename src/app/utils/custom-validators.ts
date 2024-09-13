import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Validateur pour les caractères spéciaux
  static noSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Regex pour vérifier les caractères spéciaux, y compris ceux utilisés dans les scripts
      const forbidden = /[<>`!@#$%^&*()_+=[\]{};:"\\|,<>/?~]/.test(control.value);
      return forbidden ? { 'specialCharacters': { value: control.value } } : null;
    };
  }

    static positiveInteger(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          if (control.value !== null && control.value !== undefined) {
            if (!Number.isInteger(control.value)) {
              return { notInteger: true };
            }
            if (control.value <= 0) {
              return { notPositive: true };
            }
          }
          return null;
        };
      }

  static minimumAmount(minAmount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      if (isNaN(value)) {
        return { 'invalidNumber': { value: control.value } };
      }
      const isValid = value >= minAmount;
      return isValid ? null : { 'minimumAmount': { value: control.value } };
    };
  }

    static multipleOf(price: number): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const isValid = control.value % price === 0;
        return isValid ? null : { notMultipleOf: { value: control.value } };
      };
    }
}
