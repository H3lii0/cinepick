import { MediaFilter } from '../../../models/media.model';

const GENRE_DOCUMENTARY = 99;
const GENRE_ANIME       = 16;

export type TmdbEndpointRequest = {
  path:      string;
  mediaType: 'movie' | 'tv';
};

/**
 * Responsabilidade única: montar os paths de endpoint da TMDB.
 * Classe estática pura — sem dependências, testável sem Angular TestBed.
 */
export class TmdbEndpointBuilder {
  static build(filter: MediaFilter, page: number): TmdbEndpointRequest[] {
    const base = `sort_by=popularity.desc&page=${page}`;

    const movie = (extra = ''): TmdbEndpointRequest => ({
      path:      `/discover/movie?${base}${extra ? '&' + extra : ''}`,
      mediaType: 'movie',
    });

    const tv = (extra = ''): TmdbEndpointRequest => ({
      path:      `/discover/tv?${base}${extra ? '&' + extra : ''}`,
      mediaType: 'tv',
    });

    const map: Record<MediaFilter, TmdbEndpointRequest[]> = {
      movie:       [movie()],
      series:      [tv()],
      anime:       [tv(`with_genres=${GENRE_ANIME}`)],
      documentary: [
        movie(`with_genres=${GENRE_DOCUMENTARY}`),
        tv(`with_genres=${GENRE_DOCUMENTARY}`),
      ],
      all:         [movie(), tv()],
    };

    return map[filter] ?? map['all'];
  }
}
