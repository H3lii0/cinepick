import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LightningIcon } from '../../../../shared/icons/ui/lightning';
import { CloseIcon } from '../../../../shared/icons/ui/close';
import { StarIcon } from '../../../../shared/icons/ui/star';
import { SparklesAnimationIcon } from '../../../../shared/icons/ui/sparkles-animation';
import { HERO_FILTER_IDS } from '../../../../constants/navigation.constants';
import { Media, MediaFilter, MediaType } from '../../../../models/media.model';
import { Language } from '../../../../services/language';
import { Recommendation } from '../../../../services/recommendation/recommendation';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-hero',
  imports: [
    LightningIcon,
    CloseIcon,
    StarIcon,
    SparklesAnimationIcon,
    TranslocoModule,
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  readonly langSvc = inject(Language);
  readonly heroFilterIds = HERO_FILTER_IDS;
  readonly heroBackdrop =
    'https://images.unsplash.com/photo-1761845064537-929979725425?w=1920&q=80';
  readonly selectedFilter = signal<MediaFilter>('all');
  readonly recommendation = signal<Media | null>(null);
  readonly recommendationError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isSpinning = signal(false);
  private readonly recommendationService = inject(Recommendation);

  onHeroFilterSelect(filter: MediaFilter): void {
    this.selectedFilter.set(filter);
    this.recommendation.set(null);
    this.setModalScrollLock(false);
    this.recommendationError.set(null);
  }

  dismissRecommendation(): void {
    this.recommendation.set(null);
    this.setModalScrollLock(false);
  }

  async handleRecommend(exclude?: number): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.isSpinning.set(true);
    this.recommendationError.set(null);

    try {
      const recommendation = await this.recommendationService.getRecommendation({
        filter: this.selectedFilter(),
        fallbackBackdrop: this.heroBackdrop,
        excludeId: exclude,
        language: this.langSvc.lang() === 'pt-BR' ? 'pt-BR' : 'en-US',
      });
      this.recommendation.set(recommendation);
      this.setModalScrollLock(true);
    } catch (error) {
      this.recommendationError.set('hero.error');
    } finally {
      this.isLoading.set(false);
      this.isSpinning.set(false);
    }
  }

  ngOnDestroy(): void {
    this.setModalScrollLock(false);
  }

  mediaTypeLabel(type: MediaType): string {
    return `mediaType.${type}`;
  }

  private setModalScrollLock(locked: boolean): void {
    const isMobileOrTablet = window.matchMedia('(max-width: 1099px)').matches;
    document.body.classList.toggle('modal-open', locked && isMobileOrTablet);
  }

}
