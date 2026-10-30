import { Injectable, inject, signal } from '@angular/core';
import { Media, MediaFilter } from '../../models/media.model';
import { TmdbClient, RecommendationLanguage } from './tmdb/tmdb.client';
import { TmdbMediaMapper } from './tmdb/tmdb-media.mapper';

type RecommendationRequest = {
  filter:           MediaFilter;
  fallbackBackdrop: string;
  excludeId?:       number;
  language?:        RecommendationLanguage;
  onCandidates?:    (posters: string[]) => Promise<void>;
};

/**
 * Orquestra a busca de recomendações:
 * delega HTTP ao TmdbClient, transformação ao TmdbMediaMapper,
 * e aplica as regras de negócio (filtragem, exclusão de duplicata, estado de loading).
 *
 * É o único serviço que os componentes precisam conhecer.
 */
@Injectable({ providedIn: 'root' })
export class Recommendation {
  private readonly client = inject(TmdbClient);

  readonly loading = signal(false);

  async getRecommendation(request: RecommendationRequest): Promise<Media> {
    const language = request.language ?? 'pt-BR';
    this.loading.set(true);

    try {
      const items = await this.client.fetchRandom(request.filter, language);

      const valid = items.filter(
        item =>
          item.overview?.trim() &&
          (item.title || item.name) &&
          item.id !== request.excludeId,
      );

      if (valid.length === 0) {
        throw new Error('Nenhum resultado encontrado. Tente novamente.');
      }

      const selected = valid[Math.floor(Math.random() * valid.length)];
      const posters = valid.filter(item => item.poster_path && item !== selected)
        .sort(() => Math.random() - 0.5).slice(0, 7)
        .map(item => `https://image.tmdb.org/t/p/w500${item.poster_path}`);
      posters.push(selected.poster_path ? `https://image.tmdb.org/t/p/w500${selected.poster_path}` : request.fallbackBackdrop);
      const [item] = await Promise.all([
        this.client.fetchDetails(selected.media_type, selected.id, language),
        request.onCandidates?.(posters),
      ]);
      return TmdbMediaMapper.toMedia(item, request.filter, request.fallbackBackdrop);
    } finally {
      this.loading.set(false);
    }
  }
}
