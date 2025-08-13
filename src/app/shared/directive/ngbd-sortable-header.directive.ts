import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

//export type SortColumn = keyof IProduct | IConfirmPayment | '';
export type SortDirection = 'asc' | 'desc' | '';

const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  standalone: true,
  host: {
      '[class.asc]': 'direction === "asc"',
      '[class.desc]': 'direction === "desc"',
      '(click)': 'rotate()',
  },
})
export class NgbdSortableHeaderDirective {
  @Input() sortable: string = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  @HostListener('click') rotate() {
      console.info('clicked: ');
      this.direction = rotate[this.direction];
      this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}