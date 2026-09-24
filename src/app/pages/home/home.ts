import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Hero } from './components/hero/hero';
import { Navbar } from '../../core/layout/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [Navbar, Hero],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
