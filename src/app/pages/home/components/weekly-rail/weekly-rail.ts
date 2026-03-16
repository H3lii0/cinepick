import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { WEEKLY_SECTIONS_META, getWeeklyReleases } from '../../../../constants/navigation.constants';
import type { Media, MediaType } from '../../../../models/media.model';
import type { CategoryMeta } from '../../../../types/navigation.types';
import { SparklesIcon } from "../../../../shared/icons/ui/sparkles";
import { StarIcon } from "../../../../shared/icons/ui/star";
import { CalendarIcon } from '../../../../shared/icons/ui/calendar';
import { ChevronLeftIcon } from "../../../../shared/icons/navigation/chevron-left";
import { ChevronRightIcon } from '../../../../shared/icons/navigation/chevron-right';

type WeeklySection = {
  key: string;
  accent: CategoryMeta['accent'];
  type: MediaType;
  items: Media[];
};

@Component({
  selector: 'app-weekly-rail',
  imports: [
    TranslocoModule,
    SparklesIcon,
    StarIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  ],
  templateUrl: './weekly-rail.html',
  styleUrl: './weekly-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyRail {
  readonly weeklySections = computed<WeeklySection[]>(() =>
    WEEKLY_SECTIONS_META.map((section) => ({
      key: section.key,
      accent: section.accent,
      type: section.type,
      items: getWeeklyReleases(section.type),
    })).filter((section) => section.items.length > 0),
  );

  scrollRail(container: HTMLElement, direction: 'left' | 'right', ratio = 0.75): void {
    const amount = container.clientWidth * ratio;
    container.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  }

  mediaChipLabel(type: MediaType): string {
    if (type === 'series') {
      return 'SERIES';
    }
    if (type === 'documentary') {
      return 'DOC';
    }
    if (type === 'movie') {
      return 'MOVIE';
    }
    return 'ANIME';
  }

  mediaTypeClass(type: MediaType): string {
    if (type === 'series') {
      return 'chip-series';
    }
    if (type === 'documentary') {
      return 'chip-documentary';
    }
    return 'chip-movie';
  }
}
