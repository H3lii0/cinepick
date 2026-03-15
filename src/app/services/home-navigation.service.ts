import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

import { SECTION_DOM_IDS } from '../constants/navigation.constants';
import type { MediaFilter } from '../models/media.model';
import type { SectionId } from '../types/navigation.types';

@Injectable({ providedIn: 'root' })
export class HomeNavigationService {
  readonly activeSection = signal<SectionId>('hero');
  readonly activeCategory = signal<MediaFilter>('all');

  private readonly document = inject(DOCUMENT);

  isBottomNavActive(id: SectionId): boolean {
    const current = this.activeSection();
    return current === id || (id === 'movies' && current === 'category');
  }

  selectCategory(category: MediaFilter): void {
    this.activeCategory.set(category);
    this.activeSection.set(category === 'all' ? 'movies' : this.mapCategoryToSection(category));
  }

  scrollTo(section: SectionId): void {
    if (section === 'movies' || section === 'series' || section === 'anime' || section === 'documentary') {
      this.activeCategory.set(this.mapSectionToCategory(section));
    }

    const domId = SECTION_DOM_IDS[section];
    const element = this.document.getElementById(domId);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeSection.set(section);
  }

  syncCategorySection(): void {
    this.activeSection.set(
      this.activeCategory() === 'all' ? 'movies' : this.mapCategoryToSection(this.activeCategory()),
    );
  }

  private mapSectionToCategory(section: SectionId): MediaFilter {
    if (section === 'movies') {
      return 'movie';
    }
    if (section === 'series') {
      return 'series';
    }
    if (section === 'anime') {
      return 'anime';
    }
    if (section === 'documentary') {
      return 'documentary';
    }
    return 'all';
  }

  private mapCategoryToSection(category: MediaFilter): SectionId {
    if (category === 'movie') {
      return 'movies';
    }
    if (category === 'series') {
      return 'series';
    }
    if (category === 'anime') {
      return 'anime';
    }
    if (category === 'documentary') {
      return 'documentary';
    }
    return 'movies';
  }
}
