import { Component, inject, signal } from '@angular/core';
import { PlayerCircle } from '../../../shared/icons/actions/player-circle';
import { Language } from '../../../services/language';

@Component({
  selector: 'app-navbar',
  imports: [PlayerCircle],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly langSvc = inject(Language);
  readonly navbarCompact = signal(false);
  private readonly cleanupFns: Array<() => void> = [];

  constructor() {
    this.setupScrollState();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((cleanup) => cleanup());
  }

  private setupScrollState(): void {
    const listener = () => {
      this.navbarCompact.set(window.scrollY > 40);
    };

    window.addEventListener('scroll', listener, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener('scroll', listener));
  }


  setLanguage(lang: 'pt-BR' | 'en'): void {
    this.langSvc.setLang(lang);
  }
}
