import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { CATEGORY_METAS, SORT_OPTION_IDS, allMedia } from '../../../../constants/navigation.constants';
import type { Media, MediaFilter, MediaType, SortOption } from '../../../../models/media.model';
import type { CategoryMeta } from '../../../../types/navigation.types';
import { HomeNavigationService } from '../../../../services/home-navigation.service';

@Component({
  selector: 'app-category-section',
  imports: [TranslocoModule],
  templateUrl: './category-section.html',
  styleUrl: './category-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySection {
  private readonly homeNavigation = inject(HomeNavigationService);

  readonly categoryMetas = CATEGORY_METAS;
  readonly sortOptionIds = SORT_OPTION_IDS;
  readonly sortBy = signal<SortOption>('popularity');
  readonly sortOpen = signal(false);
  readonly activeCategory = this.homeNavigation.activeCategory;

  readonly filteredMedia = computed<Media[]>(() => {
    const category = this.activeCategory();
    const sort = this.sortBy();
    const items = category === 'all' ? allMedia : allMedia.filter((item) => item.type === category);

    if (sort === 'rating') {
      return [...items].sort((a, b) => b.rating - a.rating);
    }

    if (sort === 'release') {
      return [...items].sort((a, b) => b.year - a.year);
    }

    return [...items].sort(
      (a, b) =>
        (b.trendingRank != null ? 1 : 0) - (a.trendingRank != null ? 1 : 0) || b.rating - a.rating,
    );
  });

  readonly activeCategoryMeta = computed<CategoryMeta>(() => {
    return this.categoryMetas.find((category) => category.id === this.activeCategory()) ?? this.categoryMetas[0];
  });

  selectCategory(category: MediaFilter): void {
    this.homeNavigation.selectCategory(category);
  }

  selectSort(sort: SortOption): void {
    this.sortBy.set(sort);
    this.sortOpen.set(false);
  }

  mediaChipLabel(type: MediaType): string {
    if (type === 'series') {
      return 'SERIES';
    }
    if (type === 'documentary') {
      return 'DOC';
    }
    if (type === 'movie') {
      return 'FILM';
    }
    return 'ANIME';
  }

  mediaTypeClass(type: MediaType): string {
    if (type === 'anime') {
      return 'chip-anime';
    }
    if (type === 'series') {
      return 'chip-series';
    }
    if (type === 'documentary') {
      return 'chip-documentary';
    }
    return 'chip-movie';
  }
}
