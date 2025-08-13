import { ContentChild, Directive, Input } from '@angular/core';
import { AccordionContentDirective } from './accordion-content.directive';
import { AccordionTitleDirective } from './accordion-title.directive';
import { AccordionHeaderDirective } from './accordion-header.directive';

@Directive({
  selector: 'accordion-item',
  standalone: true,
})
export class AccordionItemDirective {
  @Input() title = '';
  @Input() disabled = false;
  @Input() expanded = false;
  @ContentChild(AccordionContentDirective) content:
    | AccordionContentDirective
    | undefined;
  @ContentChild(AccordionTitleDirective) customTitle:
    | AccordionTitleDirective
    | undefined;
  @ContentChild(AccordionHeaderDirective) customHeader:
    | AccordionHeaderDirective
    | undefined;
}
