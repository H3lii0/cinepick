export interface TrendingItem {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  original_language: string;
  genre_ids: number[];
  adult: boolean;
}

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}
