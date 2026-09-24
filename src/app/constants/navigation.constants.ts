import type { MediaFilter } from '../models/media.model';

export const HERO_FILTER_IDS: MediaFilter[] = [
  'all',
  'movie',
  'series',
  'documentary',
];

export const streamingBrandColors: Record<string, string> = {
  Netflix: '#dc2626',
  'HBO Max': '#6d28d9',
  'Prime Video': '#3b82f6',
  'Apple TV+': '#374151',
  'Disney+': '#1d4ed8',
  Hulu: '#16a34a',
  Crunchyroll: '#f97316',
  Shudder: '#7f1d1d',
  'BBC iPlayer': '#b91c1c',
};
