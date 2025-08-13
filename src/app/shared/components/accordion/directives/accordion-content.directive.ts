import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[accordionContent]',
  standalone: true,
})
export class AccordionContentDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
