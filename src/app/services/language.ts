import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type LanguageType = 'pt-BR' | 'en';

const STORAGE_KEY = 'cinepick-lang';

@Injectable({
  providedIn: 'root',
})
export class Language {
  private readonly transloco = inject(TranslocoService);
  private readonly _lang = signal<LanguageType>(this.loadLang());

  readonly lang = this._lang.asReadonly();
  readonly isEnglish = computed(() => this._lang() === 'en');

  constructor() {
    this.transloco.setActiveLang(this._lang());
  }

  setLang(lang: LanguageType): void {
    this._lang.set(lang);
    this.transloco.setActiveLang(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  toggle(): void {
    this.setLang(this._lang() === 'pt-BR' ? 'en' : 'pt-BR');
  }

  private loadLang(): LanguageType {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pt-BR' || stored === 'en') {
      return stored;
    }

    return navigator.language.startsWith('en') ? 'en' : 'pt-BR';
  }
}
