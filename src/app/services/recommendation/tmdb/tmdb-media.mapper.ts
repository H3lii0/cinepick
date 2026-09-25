import { Media, MediaFilter, MediaType } from '../../../models/media.model';
import { TmdbItem } from '../../../models/tmdb.model';

const TMDB_POSTER_BASE_URL      = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL    = 'https://image.tmdb.org/t/p/w1280';
const TMDB_ANIME_GENRE_ID       = 16;
const TMDB_DOCUMENTARY_GENRE_ID = 99;

const TMDB_GENRE_LABELS: Record<number, string> = {
  12:    'Adventure',
  14:    'Fantasy',
  16:    'Animação',
  18:    'Drama',
  27:    'Horror',
  28:    'Action',
  35:    'Comedy',
  36:    'History',
  37:    'Western',
  53:    'Thriller',
  80:    'Crime',
  99:    'Documentary',
  878:   'Sci-Fi',
  9648:  'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

/**
 * Responsabilidade única: converter TmdbItem → Media (modelo de domínio).
 * Classe estática pura — sem efeitos colaterais, testável de forma isolada.
 */
export class TmdbMediaMapper {
  static toMedia(
    item: TmdbItem,
    activeFilter: MediaFilter,
    fallbackBackdrop: string,
  ): Media {
    const type         = TmdbMediaMapper.resolveType(item, activeFilter);
    const backdropPath = item.backdrop_path
      ? `${TMDB_BACKDROP_BASE_URL}${item.backdrop_path}`
      : fallbackBackdrop;

    return {
      id:          item.id,
      title:       item.title ?? item.name ?? 'Untitled',
      type,
      genres:      TmdbMediaMapper.mapGenres(item.genre_ids, type),
      rating:      Number(item.vote_average.toFixed(1)),
      year:        TmdbMediaMapper.extractYear(item.release_date ?? item.first_air_date),
      poster:      item.poster_path
                     ? `${TMDB_POSTER_BASE_URL}${item.poster_path}`
                     : backdropPath,
      backdrop:    backdropPath,
      description: item.overview || 'No synopsis available.',
      providers:   TmdbMediaMapper.mapProviders(item),
      watchLink:   item.watch_providers?.link,
      trailerUrl:  TmdbMediaMapper.mapTrailer(item),
    };
  }

  private static resolveType(item: TmdbItem, filter: MediaFilter): MediaType {
    if (filter === 'anime')       return 'anime';
    if (filter === 'documentary') return 'documentary';
    if (item.genre_ids.includes(TMDB_DOCUMENTARY_GENRE_ID)) return 'documentary';
    if (item.genre_ids.includes(TMDB_ANIME_GENRE_ID) && item.media_type === 'tv') return 'anime';
    return item.media_type === 'movie' ? 'movie' : 'series';
  }

  private static mapGenres(genreIds: number[], type: MediaType): string[] {
    const labels = Array.from(
      new Set(
        genreIds
          .map(id => TMDB_GENRE_LABELS[id])
          .filter((label): label is string => Boolean(label)),
      ),
    );

    if (labels.length > 0) return labels;

    const fallback: Record<MediaType, string> = {
      series:      'TV Series',
      anime:       'Animação',
      documentary: 'Documentary',
      movie:       'Movie',
    };

    return [fallback[type]];
  }

  private static extractYear(rawDate?: string): number {
    const year = Number(rawDate?.slice(0, 4));
    return Number.isFinite(year) && year > 0 ? year : new Date().getFullYear();
  }

  private static mapProviders(item: TmdbItem): string[] {
    const providers = [
      ...(item.watch_providers?.flatrate ?? []),
      ...(item.watch_providers?.free ?? []),
      ...(item.watch_providers?.ads ?? []),
    ];

    return Array.from(new Map(providers.map(provider => [provider.provider_id, provider.provider_name])).values());
  }

  private static mapTrailer(item: TmdbItem): string | undefined {
    const trailer = (item.videos ?? []).find(video =>
      video.site === 'YouTube' && video.type === 'Trailer',
    );

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined;
  }
}
