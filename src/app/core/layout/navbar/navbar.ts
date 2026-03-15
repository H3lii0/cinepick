import { Component, signal } from '@angular/core';
import { PlayerCircle } from '../../../shared/icons/actions/player-circle';
import { IconSearch } from '../../../shared/icons/actions/search';
import { CloseIcon } from '../../../shared/icons/actions/close';
import { UserIcon } from '../../../shared/icons/ui/user';

@Component({
  selector: 'app-navbar',
  imports: [
    PlayerCircle,
    IconSearch,
    CloseIcon,
    UserIcon
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly searchValue = signal('');
  readonly searchOpenBar = signal(false);
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


  toggleSearchBar() {
    if (this.searchOpenBar()) {
      this.searchValue.set('');
    }
    this.searchOpenBar.update((open) => !open);
  }

  closeSearchBar(): void {
    this.searchOpenBar.set(false);
    this.searchValue.set('');
  }
}
