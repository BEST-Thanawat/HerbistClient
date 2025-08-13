import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[accordionTitle]',
  standalone: true,
})
export class AccordionTitleDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
