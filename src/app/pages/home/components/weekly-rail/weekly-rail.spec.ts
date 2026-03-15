import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyRail } from './weekly-rail';

describe('WeeklyRail', () => {
  let component: WeeklyRail;
  let fixture: ComponentFixture<WeeklyRail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyRail],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyRail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
