import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { BOTTOM_NAV_IDS } from '../../../constants/navigation.constants';
import type { SectionId } from '../../../types/navigation.types';
import { HomeNavigationService } from '../../../services/home-navigation.service';

@Component({
  selector: 'app-bottom-nav',
  imports: [TranslocoModule],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNav {
  readonly bottomNavIds = BOTTOM_NAV_IDS;

  private readonly document = inject(DOCUMENT);
  private readonly homeNavigation = inject(HomeNavigationService);
  private readonly intersectionObservers: IntersectionObserver[] = [];

  constructor() {
    afterNextRender(() => {
      this.setupSectionObservers();
    });
  }

  ngOnDestroy(): void {
    this.intersectionObservers.forEach((observer) => observer.disconnect());
  }

  isBottomNavActive(id: SectionId): boolean {
    return this.homeNavigation.isBottomNavActive(id);
  }

  scrollTo(section: SectionId): void {
    this.homeNavigation.scrollTo(section);
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
