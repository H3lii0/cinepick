import { Component, input } from '@angular/core';

@Component({
  selector: 'app-lightning-icon',
  standalone: true,
  styles: [`
    :host {
      display: inline-flex;
    }
    .bolt {
      animation: boltGlow 2.5s ease-in-out infinite;
    }
    @keyframes boltGlow {
      0%, 100% {
        filter:
          drop-shadow(0 0 2px rgba(168, 85, 247, 0.5))
          drop-shadow(0 0 4px rgba(168, 85, 247, 0.2));
        opacity: 0.8;
      }
      50% {
        filter:
          drop-shadow(0 0 6px rgba(168, 85, 247, 1))
          drop-shadow(0 0 14px rgba(168, 85, 247, 0.6))
          drop-shadow(0 0 26px rgba(168, 85, 247, 0.25));
        opacity: 1;
      }
    }
  `],
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      style="overflow: visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="bolt">
        <path
          d="M13 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13 2Z"
          fill="none"
          stroke="#a855f7"
          stroke-width="1.6"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </g>
    </svg>
  `,
})
export class LightningIcon {
  size = input<number>(24);
}
