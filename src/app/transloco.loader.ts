import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return from(fetch(`/assets/i18n/${lang}.json`).then((res) => res.json()));
  }
}
