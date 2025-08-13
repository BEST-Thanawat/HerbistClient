import { Component, OnInit, Input, Output, EventEmitter, ElementRef, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ProductService } from '../../../../shared/services/product.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
// import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-tags',
  imports: [CommonModule, TranslateModule],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  @Input() allTags: any[] = [];
  //@Input() tags: any[] = [];
  @Output() tagsFilter: EventEmitter<string[]> = new EventEmitter<string[]>();
  public collapse: boolean = true;
  @ViewChildren("tags_checkboxes") checkboxes: QueryList<ElementRef> | undefined;
  @Input() resetTag: Subject<boolean[]> = new Subject<boolean[]>();
  tags: string[] = [];
  navigationSubs = new Subscription();
  mobileSideBar: boolean | undefined;

  constructor(public productService: ProductService, public shopService: ShopService) { 
    this.navigationSubs = this.shopService.getMobileSidebar().subscribe({
      next: (value: boolean) => {
        //console.log(value);
        this.mobileSideBar = value;
      }
    });
  }

  ngOnInit(): void {
    this.resetTag.subscribe((response: any) => {
      if (response) {
        this.tags = response;
        this.checkboxes!.forEach((element) => {
          let tempTag = this.tags.filter(val => val == element.nativeElement.value)

          if ((tempTag) && (tempTag.length !== 0)) {
            element.nativeElement.checked = true;
          } else {
            element.nativeElement.checked = false;
          }
        });

        if ((!Array.isArray(this.tags)) || (this.tags.length == 0)) {
          this.checkboxes!.first.nativeElement.checked = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSubs.unsubscribe();
    this.shopService.setMobileSidebar(false);
  }

  appliedFilter(event: any) {
    // this.ngxLoader.startLoader('loader-01');
    this.toggleMobileSidebar();

    this.checkboxes!.forEach((element) => {
      if (event.target.value == 'All') {
        if (element.nativeElement.value != event.target.value) {
          element.nativeElement.checked = false;
        }
        this.tags = [];
      }
      else {
        this.checkboxes!.first.nativeElement.checked = false;

        if (element.nativeElement.value == event.target.value && (event.target.checked)) {
          this.tags.push(event.target.value);
        }

        if (element.nativeElement.value == event.target.value && (!event.target.checked)) {
          let index = this.tags.indexOf(event.target.value);
          this.tags.splice(index, 1);
        }
      }
    });

    if (!(Array.isArray(this.tags)) || (this.tags.length == 0)) {
      this.checkboxes!.first.nativeElement.checked = true;
    }
    this.tagsFilter.emit(this.tags);

    // this.ngxLoader.stopLoader('loader-01');
  }

  checked(tag: string) {
    if (tag === 'All') {
      return true;
    }

    return null;
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    if (!this.mobileSideBar) return;

    this.shopService.setMobileSidebar(!this.mobileSideBar);
  }
}
