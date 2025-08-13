import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { AppService } from '../services/app.service';

@Directive({
  selector: '[Lazyimg]'
})
export class LazyimgDirective implements AfterViewInit {
  @Output() public Lazyimg: EventEmitter<any> = new EventEmitter();
  private _intersectionObserver?: IntersectionObserver;

  constructor(private _element: ElementRef, private appService: AppService) { }
  
  ngAfterViewInit(): void {
    if (this.appService.isBrowser()) {
      this._intersectionObserver = new IntersectionObserver(entries => {
        this.checkForIntersection(entries);
      }, {});
      this._intersectionObserver.observe(<Element>(this._element.nativeElement));
    }
  }

  private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (this.checkIfIntersecting(entry)) {
        this.Lazyimg.emit();
        this._intersectionObserver!.unobserve(<Element>(this._element.nativeElement));
        this._intersectionObserver!.disconnect();
      }
    });
  }

  private checkIfIntersecting(entry: IntersectionObserverEntry) {
    return (<any>entry).isIntersecting && entry.target === this._element.nativeElement;
  }

  // constructor({ nativeElement }: ElementRef<HTMLImageElement>) {
  //   const supports = 'loading' in HTMLImageElement.prototype;

  //   if (supports) {
  //     nativeElement.setAttribute('loading', 'lazy');
  //   } else {
  //     // fallback to IntersectionObserver
  //   }
  // }
}
