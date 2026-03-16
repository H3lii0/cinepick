import { Component, input } from "@angular/core";

@Component({
  selector: "app-chevron-left-icon",
  host: { style: 'display: flex' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)" stroke="rgba(225,225,225, 0.6)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 6L15 12L9 18" stroke="#rgba(225,225,225, 0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  `
})
export class ChevronLeftIcon {
  size = input<number>(24);
}
