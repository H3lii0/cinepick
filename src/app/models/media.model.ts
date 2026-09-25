export type MediaType = 'movie' | 'series' | 'anime' | 'documentary';

export type MediaFilter = MediaType | 'all';

export interface Media {
  id: number;
  title: string;
  type: MediaType;
  genres: string[];
  rating: number;
  year: number;
  poster: string;
  backdrop: string;
  description: string;
  providers: string[];
  watchLink?: string;
  trailerUrl?: string;
}
