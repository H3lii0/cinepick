import { Component, input } from "@angular/core";

@Component({
  selector: "app-sliders-icon",
  template: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 4H20V20H4V4Z" fill="rgba(225,225,225, 0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 8H20M4 12H20M4 16H20M8 4V20M12 4V20M16 4V20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  `
})
export class SlidersIcon {
  size = input<number>(24);
}
