import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Hero } from './components/hero/hero';
import { Navbar } from '../../core/layout/navbar/navbar';
import { WeeklyRail } from './components/weekly-rail/weekly-rail';
import { TrendingSection } from './components/trending-section/trending-section';
import { CategorySection } from './components/category-section/category-section';
import { Footer } from './components/footer/footer';
import { BottomNav } from '../../core/layout/bottom-nav/bottom-nav';
import { HomeNavigationService } from '../../services/home-navigation.service';

@Component({
  selector: 'app-home',
  imports: [
    Navbar,
    Hero,
    WeeklyRail,
    TrendingSection,
    CategorySection,
    Footer,
    BottomNav,
  ],
  providers: [HomeNavigationService],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
