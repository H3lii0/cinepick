import { Component, signal } from '@angular/core';
import { PlayerCircle } from '../../shared/icon/player-circle';
import { IconSearch } from '../../shared/icon/search';
import { CloseIcon } from '../../shared/icon/close';
import { UserIcon } from '../../shared/icon/user';

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
