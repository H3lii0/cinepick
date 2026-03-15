import { Component, input } from "@angular/core";

@Component({
  selector: "app-sparkles-animation-icon",
  standalone: true,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" [class]="svgStyle()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/>
      <path d="M22 5h-4"/>
      <path d="M4 17v2"/>
      <path d="M5 18H3"/>
    </svg>`,
  styles: `
    .sparkles-draw path {
      stroke-dasharray: 70;
      stroke-dashoffset: 70;
      animation: drawBi 3s ease-in-out infinite;
    }

    .sparkles-draw path:nth-child(2) { animation-delay: 0.25s; }
    .sparkles-draw path:nth-child(3) { animation-delay: 0.5s; }
    .sparkles-draw path:nth-child(4) { animation-delay: 0.75s; }
    .sparkles-draw path:nth-child(5) { animation-delay: 1s; }

    @keyframes drawBi {
      0% { stroke-dashoffset: 70; }
      40% { stroke-dashoffset: 0; }
      60% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 70; }
    }
  `
})
export class SparklesAnimationIcon {
  size = input<number>(24);
  svgStyle = input<string>('');
}
