import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IBrand } from '../../../../shared/classes/brand';
import { ShopService } from '../../../../shared/services/shop.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-brands',
  imports: [CommonModule, TranslateModule],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit, OnDestroy {
  @Input() allBrands: IBrand[] = [];
  @Output() brandsFilter: EventEmitter<any> = new EventEmitter<any>();
  public collapse: boolean = true;
  @ViewChildren("brands_checkboxes") checkboxes: QueryList<ElementRef> | undefined;

  @Input() resetBrand: Subject<boolean> = new Subject<boolean>();
  navigationSubs = new Subscription();
  mobileSideBar: boolean | undefined;
  
  constructor(public shopService: ShopService) { 
    this.navigationSubs = this.shopService.getMobileSidebar().subscribe({
      next: (value: boolean) => {
        //console.log(value);
        this.mobileSideBar = value;
      }
    });
  }

  ngOnInit(): void {
    this.resetBrand.subscribe((response: Boolean) => {
      if (response) {
        this.checkboxes!.forEach((element) => {
          if (element.nativeElement.value == 'All') {
            element.nativeElement.checked = true;
          } else {
            element.nativeElement.checked = false;
          }
        });
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

    let selectedBrands = false;

    this.checkboxes!.forEach((element) => {
      if (event.target.value == 'All') {
        if (element.nativeElement.value != event.target.value) {
          element.nativeElement.checked = false;
        }
      } else {
        this.checkboxes!.first.nativeElement.checked = false;
        if (element.nativeElement.id != event.target.id)
          element.nativeElement.checked = false;
      }

      if (element.nativeElement.checked) {
        selectedBrands = true;
      }
    });

    if (!selectedBrands) {
      this.checkboxes!.first.nativeElement.checked = true;
    }

    this.brandsFilter.emit(selectedBrands ? event.target.id : 0);

    // this.ngxLoader.stopLoader('loader-01');
  }

  checked(id: number) {
    if (id === 0) return true;

    return false;
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    if (!this.mobileSideBar) return;

    this.shopService.setMobileSidebar(!this.mobileSideBar);
  }
}
