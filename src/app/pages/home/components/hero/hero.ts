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
  readonly spinPoster = signal<string | null>(null);
  readonly nextSpinPoster = signal<string | null>(null);
  readonly spinDirection = signal<'left' | 'right'>('right');
  readonly spinPhase = signal<'out' | 'in'>('in');
  private requestVersion = 0;
  private readonly recommendationService = inject(Recommendation);

  onHeroFilterSelect(filter: MediaFilter): void {
    this.requestVersion++;
    this.isLoading.set(false);
    this.isSpinning.set(false);
    this.spinPoster.set(null);
    this.selectedFilter.set(filter);
    this.recommendation.set(null);
    this.setModalScrollLock(false);
    this.recommendationError.set(null);
  }

  dismissRecommendation(): void {
    this.requestVersion++;
    this.isLoading.set(false);
    this.isSpinning.set(false);
    this.spinPoster.set(null);
    this.recommendation.set(null);
    this.setModalScrollLock(false);
  }

  async handleRecommend(exclude?: number): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    const version = ++this.requestVersion;
    this.recommendationError.set(null);

    try {
      const recommendation = await this.recommendationService.getRecommendation({
        filter: this.selectedFilter(),
        fallbackBackdrop: this.heroBackdrop,
        excludeId: exclude,
        language: this.langSvc.lang() === 'pt-BR' ? 'pt-BR' : 'en-US',
        onCandidates: posters => this.animatePosters(posters, version),
      });
      if (version !== this.requestVersion) return;
      this.isSpinning.set(false);
      this.recommendation.set(recommendation);
      this.setModalScrollLock(true);
    } catch (error) {
      if (version === this.requestVersion) {
        this.requestVersion++;
        this.isLoading.set(false);
        this.isSpinning.set(false);
        this.spinPoster.set(null);
        this.recommendationError.set('hero.error');
        this.setModalScrollLock(false);
      }
    } finally {
      if (version === this.requestVersion) {
        this.isLoading.set(false);
        this.isSpinning.set(false);
        this.spinPoster.set(null);
      }
    }
  }

  ngOnDestroy(): void {
    this.requestVersion++;
    this.setModalScrollLock(false);
  }

  mediaTypeLabel(type: MediaType): string {
    return `mediaType.${type}`;
  }

  private async animatePosters(posters: string[], version: number): Promise<void> {
    if (version !== this.requestVersion || posters.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const loaded = await Promise.all(posters.map(url => this.preloadPoster(url)));
    if (version !== this.requestVersion || !loaded[loaded.length - 1]) return;
    posters = posters.filter((_, index) => loaded[index]);
    if (posters.length < 2) return;
    this.recommendation.set(null);
    this.spinPoster.set(posters[0]);
    this.nextSpinPoster.set(posters[1]);
    this.spinPhase.set('in');
    this.isSpinning.set(true);
    this.setModalScrollLock(true);
    await new Promise(resolve => setTimeout(resolve, 550));
    for (let i = 1; i < posters.length; i++) {
      if (version !== this.requestVersion) return;
      this.spinDirection.set(i % 2 === 1 ? 'right' : 'left');
      this.spinPhase.set('out');
      await new Promise(resolve => setTimeout(resolve, 360));
      if (version !== this.requestVersion) return;
      this.spinPoster.set(posters[i]);
      this.spinPhase.set('in');
      this.nextSpinPoster.set(posters[i + 1] ?? null);
      await new Promise(resolve => setTimeout(resolve, 30 + i * 15));
    }
  }

  private preloadPoster(url: string): Promise<boolean> {
    return new Promise(resolve => {
      const image = new Image();
      const timeout = setTimeout(() => finish(false), 5000);
      const finish = (success: boolean) => {
        clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
        resolve(success);
      };
      image.onload = () => {
        if (image.decode) image.decode().then(() => finish(true), () => finish(true));
        else finish(true);
      };
      image.onerror = () => finish(false);
      image.src = url;
    });
  }

  private setModalScrollLock(locked: boolean): void {
    const isMobileOrTablet = window.matchMedia('(max-width: 1099px)').matches;
    document.body.classList.toggle('modal-open', locked && isMobileOrTablet);
  }

}
