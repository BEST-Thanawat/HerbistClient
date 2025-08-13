import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShopParams } from '../../classes/shopParams';
import { ShopService } from '../../services/shop.service';
import { IType } from '../../classes/productType';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { AppService } from '../../services/app.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, TranslateModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  // @Input() enableLoading: boolean = false;
  @Output() categoriesFilter: EventEmitter<any> = new EventEmitter<any>();
  public collapse: boolean = true;
  categories!: IType[] | undefined;
  @ViewChildren('categories_checkboxes') checkboxes:
    | QueryList<ElementRef>
    | undefined;

  navigationSubs = new Subscription();
  mobileSideBar: boolean | undefined;

  constructor(
    public productService: ProductService,
    public shopService: ShopService,
    private appService: AppService
  ) {
    if (this.appService.isBrowser()) {
      this.getProductTypes();

      this.navigationSubs = this.shopService.getMobileSidebar().subscribe({
        next: (value: boolean) => {
          //console.log(value);
          this.mobileSideBar = value;
        },
      });
    }
  }

  ngOnInit(): void {
    const params = this.productService.getShopParams();

    if (this.checkboxes) {
      this.checkboxes.forEach((element) => {
        if (element.nativeElement.id - 9000 == params.typeId) {
          element.nativeElement.checked = true;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.navigationSubs.unsubscribe();
    this.shopService.setMobileSidebar(false);
  }

  getProductTypes() {
    this.productService.getTypes().subscribe({
      next: (response) => {
        this.categories = [{ name: 'All', id: 0 }, ...response];
      },
      error: (e) => {
        console.error(e);
      },
      //complete: () => { console.info('load product types complete') }
    });
  }

  // onTypeSelected(typeId: number) {
  //   const params = this.productService.getShopParams();
  //   params.typeId = typeId - 9000;
  //   params.tags = '';
  //   params.brandId = 0;
  //   params.pageNumber = 1;
  //   this.productService.setShopParams(params);
  //   this.categoriesFilter.emit(typeId - 9000);
  // }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async appliedFilter(event: any) {
    this.toggleMobileSidebar();

    //console.log('applyfilter')
    //var spinnerRef: any;

    // if (this.enableLoading) {
    //   console.log(1)
    //   //var spinnerRef = this.dialogService.start(this.tts.getTranslate('Processing Order...'));
    //   // this.modalLoadingRef = this.modalService.show(LoadingComponent, { class: 'modal-sm modal-dialog-centered'});

    //   // await this.sleep(1000);
    //   this.toggleMobileSidebar();
    // }

    const params = new ShopParams();
    params.typeId = event.target.id - 9000;
    params.search = '';
    this.productService.setShopParams(params);

    let selectedCategorie = false;

    this.checkboxes!.forEach((element) => {
      if (event.target.value == 'All') {
        if (element.nativeElement.value != event.target.value) {
          element.nativeElement.checked = false;
        }
      } else {
        this.checkboxes!.first.nativeElement.checked = false;
        if (element.nativeElement.id - 9000 != event.target.id - 9000) {
          element.nativeElement.checked = false;
        }
      }

      if (element.nativeElement.checked) {
        selectedCategorie = true;
      }
    });

    if (!selectedCategorie) {
      this.checkboxes!.first.nativeElement.checked = true;
    }
    this.categoriesFilter.emit(selectedCategorie ? event.target.id - 9000 : 0);

    // if (this.enableLoading) {
    //   // this.modalLoadingRef!.hide();
    // }
  }

  checked(id: any) {
    const params = this.productService.getShopParams();
    //console.log(params)
    if (params!.typeId == id - 9000) return true;

    if (id - 9000 == 0 && params!.typeId == 0) return true;

    return false;
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    if (!this.mobileSideBar) return;

    this.shopService.setMobileSidebar(!this.mobileSideBar);
  }
}
