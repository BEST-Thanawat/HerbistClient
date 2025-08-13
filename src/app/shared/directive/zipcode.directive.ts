import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: "[formControlName][zipcode]"
})
export class ZipcodeDirective {

  constructor(public ngControl: NgControl) { }
  @HostListener("input", ["$event"])

  onKeyDown(event: Event) {
    const input = event.target as HTMLInputElement;
    let trimmed = input.value.replace(/\s+/g, "");

    if (trimmed.length > 5) {
      trimmed = trimmed.substring(0, 5);
    }
    
    input.value = trimmed;    
  }
}
