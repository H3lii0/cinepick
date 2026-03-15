export interface TmdbItem {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;           // filmes usam title
  name?: string;            // séries usam name
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  release_date?: string;    // filmes: "1999-10-15"
  first_air_date?: string;  // séries: "2008-01-20"
  genre_ids: number[];
  original_language: string;
  adult: boolean;
}

export interface TmdbResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbItem[];
}
