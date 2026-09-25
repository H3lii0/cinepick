import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TmdbItem } from '../../../models/tmdb.model';
import { MediaFilter } from '../../../models/media.model';

const RECOMMENDATION_API = '/api/recommendation';

export type RecommendationLanguage = 'pt-BR' | 'en-US';

/**
 * Cliente do endpoint seguro da aplicação, que consulta a TMDB no servidor.
 * O token da TMDB nunca deve ser colocado neste arquivo ou no bundle Angular.
 */
@Injectable({ providedIn: 'root' })
export class TmdbClient {
  private readonly http = inject(HttpClient);

  async fetchRandom(
    filter: MediaFilter,
    language: RecommendationLanguage,
  ): Promise<TmdbItem[]> {
    try {
      return await firstValueFrom(
        this.http.get<TmdbItem[]>(RECOMMENDATION_API, {
          params: { filter, language },
        }),
      );
    } catch (error) {
      throw new Error(this.resolveHttpError(error));
    }
  }

  private resolveHttpError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) return 'TMDB token rejected.';
      if (error.status === 0) return 'Recommendation API unavailable.';
      return `Recommendation API error ${error.status}.`;
    }
    if (error instanceof Error) return error.message;
    return 'Error fetching recommendation.';
  }
}
