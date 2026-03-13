import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-player-circle',
  imports: [],
  template: `
    <svg [style.width.px]="size()" [style.height.px]="size()" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--violet)" />
          <stop offset="100%" stop-color="var(--fuchsia)" />
        </linearGradient>
      </defs>
      <rect x="-2.4" y="-2.4" width="28.80" height="28.80" rx="7.2" fill="url(#pg)" />
      <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="white" />
      <path d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z" fill="white" />
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      box-shadow: 0 12px 22px rgba(139, 92, 246, 0.35);
      border-radius: 0.5em;
    }
  `]
})
export class PlayerCircle {
  size = input<number>(32);
}
