import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    // 1) Normalisation
    const raw = String(value).trim();
    // Garder + pour détecter l'international, enlever le reste non-chiffres
    const plusPref = raw.startsWith('+');
    const digits = raw.replace(/\D/g, '');

    if (!digits) return '';

    // 2) Détection FR (+33 / 0033 / 0) et format
    // Cas 0033...
    if (raw.startsWith('0033') && digits.length >= 4) {
      const after = digits.slice(4); // après 0033
      const national = after.replace(/^0/, ''); // retire un éventuel 0
      return this.formatIntl('+33', national);
    }

    // Cas +33...
    if (plusPref && raw.replace(/\s/g, '').startsWith('+33')) {
      // digits commence par 33 (car + est retiré)
      const after = digits.slice(2); // après 33
      const national = after.replace(/^0/, '');
      return this.formatIntl('+33', national);
    }

    // Cas national FR (commence par 0 et 10 chiffres)
    if (digits.length === 10 && digits.startsWith('0')) {
      return this.groupPairs(digits);
    }

    // Autre cas : on fait au mieux (groupes de 2)
    return this.groupPairs(digits);
  }

  /** Format international FR : +33 6 12 34 56 78 (1 chiffre puis paires) */
  private formatIntl(prefix: string, numbers: string): string {
    if (!numbers) return prefix;
    const first = numbers.slice(0, 1);
    const rest = numbers.slice(1).replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    return `${prefix} ${first}${rest ? ' ' + rest : ''}`.trim();
  }

  /** Groupes de 2 chiffres : 06 12 34 56 78 */
  private groupPairs(n: string): string {
    return n.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  }
}
