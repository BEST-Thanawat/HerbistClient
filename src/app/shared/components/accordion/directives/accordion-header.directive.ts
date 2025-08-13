import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[accordionHeader]',
  standalone: true,
})
export class AccordionHeaderDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
