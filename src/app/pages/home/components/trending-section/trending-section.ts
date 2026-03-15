import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { ChevronLeftIcon } from '../../../../shared/icons/navigation/chevron-left';
import { ChevronRightIcon } from '../../../../shared/icons/navigation/chevron-right';
import { getTrending, streamingBrandColors } from '../../../../constants/navigation.constants';
import type { MediaType } from '../../../../models/media.model';

@Component({
  selector: 'app-trending-section',
  imports: [
    ChevronLeftIcon,
    ChevronRightIcon,
    TranslocoModule,
  ],
  templateUrl: './trending-section.html',
  styleUrl: './trending-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendingSection {
  readonly trending = getTrending();

  scrollRail(container: HTMLElement, direction: 'left' | 'right', ratio = 0.75): void {
    const amount = container.clientWidth * ratio;
    container.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  }

  mediaTypeLabel(type: MediaType): string {
    return `mediaType.${type}`;
  }

  streamingColor(platform: string): string {
    return streamingBrandColors[platform] ?? '#4b5563';
  }
}
