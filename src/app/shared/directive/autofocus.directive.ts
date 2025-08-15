import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Ensure the element exists and then focus it
    if (this.el.nativeElement) {
      this.el.nativeElement.focus();
    }
  }
}