import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { NAV_LINK_IDS } from '../../../constants/navigation.constants';
import { HomeNavigationService } from '../../../services/home-navigation.service';
import { Language } from '../../../services/language';
import type { SectionId } from '../../../types/navigation.types';
import { PlayerCircle } from '../../../shared/icons/actions/player-circle';
import { IconSearch } from '../../../shared/icons/actions/search';
import { CloseIcon } from '../../../shared/icons/actions/close';
import { UserIcon } from '../../../shared/icons/ui/user';
import { BellNotificationsIcon } from '../../../shared/icons/actions/bell-notifications';

@Component({
  selector: 'app-navbar',
  imports: [
    TranslocoModule,
    PlayerCircle,
    IconSearch,
    CloseIcon,
    UserIcon,
    BellNotificationsIcon
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  readonly navLinkIds = NAV_LINK_IDS;
  readonly searchValue = signal('');
  readonly searchOpenBar = signal(false);
  readonly navbarCompact = signal(false);
  readonly langSvc = inject(Language);

  private readonly document = inject(DOCUMENT);
  private readonly homeNavigation = inject(HomeNavigationService);
  private readonly cleanupFns: Array<() => void> = [];
  private readonly intersectionObservers: IntersectionObserver[] = [];

  constructor() {
    this.setupScrollState();
    afterNextRender(() => {
      this.setupSectionObservers();
    });
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((cleanup) => cleanup());
    this.intersectionObservers.forEach((observer) => observer.disconnect());
  }

  isNavActive(id: SectionId): boolean {
    return this.homeNavigation.isBottomNavActive(id);
  }

  scrollTo(section: SectionId): void {
    this.homeNavigation.scrollTo(section);
  }

  toggleLang(): void {
    this.langSvc.toggle();
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

  private setupSectionObservers(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observe = (domId: string, section: SectionId): void => {
      const element = this.document.getElementById(domId);
      if (!element) {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (section === 'category') {
            this.homeNavigation.syncCategorySection();
            return;
          }

          this.homeNavigation.activeSection.set(section);
        },
        { threshold: 0.3 },
      );

      observer.observe(element);
      this.intersectionObservers.push(observer);
    };

    observe('hero-section', 'hero');
    observe('section-weekly', 'weekly');
    observe('section-trending', 'trending');
    observe('section-category', 'category');
  }
}
