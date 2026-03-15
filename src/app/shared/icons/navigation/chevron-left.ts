import { Component, input } from "@angular/core";

@Component({
  selector: "app-chevron-left-icon",
  template: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 6L9 12L15 18" fill="rgba(225,225,225, 0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  `
})
export class ChevronLeftIcon {
  size = input<number>(24);
}
