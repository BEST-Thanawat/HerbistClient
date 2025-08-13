import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule} from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { SeoService } from '../../../shared/services/seo.service';
import { ShopParams } from '../../../shared/classes/shopParams';
import { IProduct } from '../../../shared/classes/product';
import { IBrand } from '../../../shared/classes/brand';
import { filter, map, Subject, Subscription, takeUntil } from 'rxjs';
import { ShopService } from '../../../shared/services/shop.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../shared/services/app.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from "../widgets/pagination/pagination.component";
import { ProductBoxOneComponent } from "../../../shared/components/product/product-box-one/product-box-one.component";
import { GridComponent } from "../widgets/grid/grid.component";
import { ProductBoxVerticalSliderComponent } from "../../../shared/components/product/product-box-vertical-slider/product-box-vertical-slider.component";
import { CategoriesComponent } from "../../../shared/components/categories/categories.component";
import { BreadcrumbComponent } from "../../../shared/components/breadcrumb/breadcrumb.component";
import { BrandsComponent } from "../widgets/brands/brands.component";
import { TagsComponent } from "../widgets/tags/tags.component";

@Component({
  selector: 'app-collection-left-sidebar',
    imports: [CommonModule, TranslateModule, RouterModule, PaginationComponent, ProductBoxOneComponent, GridComponent, ProductBoxVerticalSliderComponent, CategoriesComponent, BreadcrumbComponent, BrandsComponent, TagsComponent],
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss']
})
export class CollectionLeftSidebarComponent implements OnInit, OnDestroy {

  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public products: IProduct[] = [];
  // public products$ : Observable<IProduct[]> | undefined;
  public brands: any[] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 1200;
  public tags: string[] = [];
  public category: string | undefined;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string | undefined; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;

  allBrands: IBrand[] | undefined;
  allTags: any[] | undefined;
  resetBrand: Subject<boolean> = new Subject<boolean>();
  resetTag: Subject<any[]> = new Subject<any[]>();
  pageSize = 12;

  mobileSideBar: boolean | undefined;
  navigationSubs = new Subscription();
  
  destroyed = new Subject<any>();

  bannerSrcset = '';//'150w, 220w, 295w';
  bannerSizes = '20vw';
  collectionBannerSrcset = '';//'320w, 481w, 672w, 800w, 1000w, 1200w, 1370w'
  collectionBannerSizes = '60vw';
  collectionSidebarBannerImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/collection-sidebar-banner.webp' : "assets/images/collection-sidebar-banner.webp";
  collectionBannerImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/collection-banner.webp' : "assets/images/collection-banner.webp";

  modalLoadingRef?: BsModalRef;
  
  constructor(private modalService: BsModalService, private seoService: SeoService, private router: Router, public productService: ProductService, private shopService: ShopService, private appService: AppService) {
    this.seoService.setMainPageTags('Collection(คอลเลกชัน) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');
    
    
    if (this.appService.isBrowser()) {
      this.getBrands();
      this.getTags();

      this.navigationSubs = this.shopService.getMobileSidebar().subscribe({
        next: (value: boolean) => {
          //console.log(value);
          this.mobileSideBar = value;
        }
      });

      this.shopService.setShowFooter(true);
    }
  }

  ngOnInit(): void {
    if (this.appService.isBrowser()) {
      //For main menu reload product
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd), takeUntil(this.destroyed)).subscribe((event: NavigationEnd | any) => {
        //console.log('For main menu reload product');
        this.getProducts();
      });

      //console.log('normal load product');
      const params = this.productService.getShopParams();
      params.pageSize = this.pageSize;
      this.productService.setShopParams(params);

      this.getProducts();
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next(null);
    this.destroyed.complete();

    this.navigationSubs.unsubscribe();
    this.shopService.setMobileSidebar(false);
  }

  getProducts() {
    // const params = this.productService.getShopParams();
    // params.pageSize = this.pageSize;
    // params.collections = '';
    // this.productService.setShopParams(params);
    this.productService.getProductPagination(false).pipe(map((products) => {
      if (environment.cloudinary === true) {
        let imageUrl = environment.apiUrl.replace('api/', '')
        if (imageUrl.includes('https')) { 
          imageUrl = imageUrl.replace('https', 'http');
        }
        let apiImageUrl = imageUrl + 'Content/images/products/';
        let cloudinaryUrl = environment.cloudinaryURL + '/' + environment.cloudinaryId + '/Products/';
        //  console.log(apiImageUrl);
        //  console.log(cloudinaryUrl);

        products.data.forEach((product, index, array) => {
          product.images.forEach((item, index, array) => {
            let temp = array[index].src?.includes('https') ? array[index].src!.replace('https', 'http').replace(apiImageUrl, cloudinaryUrl) : array[index].src!.replace(apiImageUrl, cloudinaryUrl);
            array[index].src = temp; 
            // console.log(array[index].src);
          });
        });        
      }
      
      return products;
    })).subscribe({
      next: (response) => {
        this.products = response.data;
        this.paginate = this.productService.getPager(+response.count, +response.pageIndex, +response.pageSize);
      },
      error: (e) => { 
        console.error(e);
        if (this.modalLoadingRef) this.modalLoadingRef!.hide();
      },
      complete: () => { 
        this.shopService.scrollToTop();
        if (this.modalLoadingRef) this.modalLoadingRef!.hide();
        //this.shopService.setShowFooter(true);
      }
    })
  }

  getBrands() {
    this.productService.getBrands().subscribe({
      next: (response: IBrand[]) => {
        this.allBrands = [{ name: 'All', id: 0 }, ...response];
      },
      error: (e) => { console.error(e) },
      //complete: () => { console.info('get brands complete') }
    })
  }

  getTags() {
    this.productService.getTags().subscribe({
      next: (response: any[]) => {
        this.allTags = ['All', ...response];
      },
      error: (e) => { console.error(e) },
      //complete: () => { console.info('get tags complete') }
    })
  }

  // Append filter value to Url
  updateFilter(tags: any) {
    this.getProducts();
  }

  updateCategories(categorie: number) {    
    this.modalLoadingRef = this.modalService.show(LoadingComponent, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true});

    this.brands = [];
    this.tags = [];

    this.resetTag.next(this.tags);
    this.resetBrand.next(true);

    const params = new ShopParams();
    params.pageSize = this.pageSize;
    params.typeId = categorie;
    this.productService.setShopParams(params);

    this.getProducts();
  }

  updateBrand(tags: any) {    
    this.modalLoadingRef = this.modalService.show(LoadingComponent, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true});

    const params = this.productService.getShopParams();
    params.pageSize = this.pageSize;
    params.brandId = tags;
    params.pageNumber = 1;
    params.collections = '';
    params.search = '';
    this.productService.setShopParams(params);

    // const params = new ShopParams();
    // params.brandId = tags;
    // this.productService.setShopParams(params);

    this.brands = [];
    if (this.productService.shopParams.brandId != 0)
      this.brands.push(this.allBrands![this.productService.shopParams.brandId].name);

    this.getProducts();
  }

  updateTags(tags: string[]) {
    this.modalLoadingRef = this.modalService.show(LoadingComponent, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true});
    
    this.tags = tags;

    // const params = new ShopParams();
    // params.tags = tags.toString();
    // this.productService.setShopParams(params);

    const params = this.productService.getShopParams();
    params.pageSize = this.pageSize;
    params.tags = tags.toString();
    params.pageNumber = 1;
    params.collections = '';
    params.search = '';
    this.productService.setShopParams(params);

    this.getProducts();
  }

  // SortBy Filter
  sortByFilter(value: any) {
    const params = this.productService.getShopParams();
    if (value == 'low') params.sort = 'priceAsc';
    else if (value == 'high') params.sort = 'priceDesc';
    else if (value == 'a-z') params.sort = 'nameAsc';
    else if (value == 'z-a') params.sort = 'nameDesc';
    else params.sort = ''

    params.collections = '';
    this.productService.setShopParams(params);

    this.productService.getProductPagination(false).subscribe({
      next: (response) => {
        this.products = response.data;
        this.paginate = this.productService.getPager(+response.count, +response.pageIndex, +response.pageSize);
      },
      error: (e) => { console.error(e) },
      //complete: () => { console.info('load products complete') }
    })

    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: { sortBy: value ? value : null },
    //   queryParamsHandling: 'merge', // preserve the existing query params in the route
    //   skipLocationChange: false  // do trigger navigation
    // }).finally(() => {
    //   this.viewScroller.setOffset([120, 120]);
    //   this.viewScroller.scrollToAnchor('products'); // Anchore Link
    // });
  }

  // Remove Tag
  removeBrand(tag: any) {
    this.resetBrand.next(true);
    this.updateBrand(0);
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(val => val !== tag);
    this.resetTag.next(this.tags);

    if ((!Array.isArray(this.tags)) || (this.tags.length == 0)) {
      this.tags = [];
    }

    this.updateTags(this.tags);
  }

  // Clear Tags
  removeAllTags() {
    // this.ngxLoader.startLoader('loader-01');
    this.reloadCurrentPage();
    // this.ngxLoader.stopLoader('loader-01');
    
    // // Clear brand
    // this.removeBrand('');

    // // Clear Tags
    // this.tags = [];
    // this.resetTag.next(this.tags);
    // if ((!Array.isArray(this.tags)) || (this.tags.length == 0)) {
    //   this.tags = [];
    // }
    // this.updateTags([]);

    // const params = new ShopParams();
    // params.tags = [].toString();
    // this.productService.setShopParams(params);

    // this.getProducts(false);
    

    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {},
    //   skipLocationChange: false  // do trigger navigation
    // }).finally(() => {
    //   this.viewScroller.setOffset([120, 120]);
    //   this.viewScroller.scrollToAnchor('products'); // Anchore Link
    // });
  }

  // product Pagination
  setPage(page: number) {
    const params = this.productService.getShopParams();
    params.pageSize = this.pageSize;
    params.pageNumber = page;
    this.productService.setShopParams(params);

    this.getProducts();
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: { page: page },
    //   queryParamsHandling: 'merge', // preserve the existing query params in the route
    //   skipLocationChange: false  // do trigger navigation
    // }).finally(() => {
    //   this.viewScroller.setOffset([120, 120]);
    //   this.viewScroller.scrollToAnchor('products'); // Anchore Link
    // });
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if (value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.shopService.setMobileSidebar(!this.mobileSideBar);
  }

  reloadCurrentPage() {
    this.updateCategories(0);
  }

  onHover(menuItem: any) {
    if(window.innerWidth > 1200 && menuItem){
       document.getElementById('unset')!.classList.add('sidebar-unset')
    } else {
      document.getElementById('unset')!.classList.remove('sidebar-unset')
    }
  }
}
