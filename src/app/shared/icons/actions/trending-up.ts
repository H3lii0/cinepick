import { Component, input } from "@angular/core";

@Component({
  selector: "app-trending-up-icon",
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 7L14.4142 13.5858C13.6332 14.3668 12.3668 14.3668 11.5858 13.5858L10.4142 12.4142C9.63316 11.6332 8.36683 11.6332 7.58579 12.4142L3 17M21 7H15M21 7V13" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  `
})
export class TrendingUpIcon {
  size = input<number>(24);
}
