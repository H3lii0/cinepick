import { Type } from '@angular/core';
import { MediaFilter, MediaType } from '../models/media.model';

export type Icon = Type<unknown>;

export type SectionId =
  | 'hero'
  | 'weekly'
  | 'trending'
  | 'movies'
  | 'series'
  | 'documentary'
  | 'category';

export type CategoryMeta = {
  id: MediaFilter;
  icon: Icon;
  accent: 'violet' | 'blue' | 'orange' | 'green' | 'rose';
};

export type WeeklySectionMeta = {
  key: string;
  accent: CategoryMeta['accent'];
  type: MediaType;
};
