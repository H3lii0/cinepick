export type MediaType = 'movie' | 'series' | 'documentary';

export type MediaFilter = MediaType | 'all';

export type SortOption = 'popularity' | 'release' | 'rating';

export interface Media {
  id: number;
  title: string;
  type: MediaType;
  genres: string[];
  rating: number;
  year: number;
  poster: string;
  backdrop: string;
  streaming: string[];
  description: string;
  duration?: string;
  seasons?: number;
  episodes?: number;
  trending?: boolean;
  weeklyRelease?: boolean;
  trendingRank?: number;
}
