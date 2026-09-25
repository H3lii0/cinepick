import { Component, input } from '@angular/core';

@Component({
  selector: 'app-star-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="m12 2.8 2.83 5.74 6.33.92-4.58 4.47 1.08 6.31L12 17.26l-5.66 2.98 1.08-6.31-4.58-4.47 6.33-.92L12 2.8Z" />
    </svg>
  `,
})
export class StarIcon {
  size = input<number>(24);
}
