import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TmdbItem, TmdbResponse } from '../../../models/tmdb.model';
import { MediaFilter } from '../../../models/media.model';
import { TmdbEndpointBuilder } from './tmdb-endpoint.builder';

const BASE_URL          = 'https://api.themoviedb.org/3';
const TMDB_BEARER_TOKEN = 'API_KEY';

export type RecommendationLanguage = 'pt-BR' | 'en-US';

/**
 * Responsabilidade única: executar requisições HTTP contra a TMDB
 * e devolver TmdbItem[]. Nenhuma regra de negócio aqui.
 */
@Injectable({ providedIn: 'root' })
export class TmdbClient {
  private readonly http  = inject(HttpClient);
  private readonly token = TMDB_BEARER_TOKEN;

  async fetchRandom(
    filter: MediaFilter,
    language: RecommendationLanguage,
  ): Promise<TmdbItem[]> {
    if (!this.token) {
      throw new Error('Token da API não configurado.');
    }

    const page     = Math.floor(Math.random() * 500) + 1;
    const requests = TmdbEndpointBuilder.build(filter, page);

    const results = await Promise.all(
      requests.map(r => this.fetchEndpoint(r.path, language)),
    );

    // Enriquece com media_type derivado do endpoint (não vem na resposta da API)
    return results.flatMap((items, i) =>
      items.map(item => ({ ...item, media_type: requests[i].mediaType })),
    );
  }

  private async fetchEndpoint(
    path: string,
    language: RecommendationLanguage,
  ): Promise<TmdbItem[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<TmdbResponse>(`${BASE_URL}${path}`, {
          headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
          params:  { language },
        }),
      );
      return response.results ?? [];
    } catch (error) {
      throw new Error(this.resolveHttpError(error));
    }
  }

  private resolveHttpError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) return 'Token inválido. Verifique sua chave da TMDB.';
      return `Erro ${error.status} ao consultar a API.`;
    }
    if (error instanceof Error) return error.message;
    return 'Erro ao buscar recomendação.';
  }
}
