import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { Subscription, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Pagination } from '../../../../shared/classes/pagination';
import { ProductBoxOneComponent } from '../../../../shared/components/product/product-box-one/product-box-one.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../../../shared/services/nav.service';

@Component({
  selector: 'app-related-product',
  imports: [TranslateModule, CommonModule, ProductBoxOneComponent],
  templateUrl: './related-product.component.html',
  styleUrls: ['./related-product.component.scss'],
})
export class RelatedProductComponent implements OnInit, OnDestroy {
  @Input() type: string | undefined;
  products!: IProduct[] | undefined;
  slice = 6;

  subscriptionParamMap = new Subscription();
  sizes = '5vw';

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private navService: NavService
  ) {
    this.subscriptionParamMap = this.route.paramMap.subscribe((paramMap) => {
      this.getProducts();
    });
  }

  ngOnInit(): void {
    const userAgent = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      this.slice = 2;
      this.sizes = '70vw';
    } else {
      this.slice = 6;
      this.sizes = '5vw';
    }
  }

  ngOnDestroy(): void {
    this.subscriptionParamMap.unsubscribe();
  }

  getProducts() {
    this.productService
      .getRelatedProducts()
      .pipe(
        map((pagination: Pagination) => {
          if (environment.cloudinary === true) {
            let imageUrl = environment.apiUrl.replace('api/', '');
            if (imageUrl.includes('https')) {
              imageUrl = imageUrl.replace('https', 'http');
            }
            let apiImageUrl = imageUrl + 'Content/images/products/';
            let cloudinaryUrl = environment.cloudinaryURL + '/' + environment.cloudinaryId + '/Products/';
            // console.log(apiImageUrl);
            // console.log(cloudinaryUrl);

            pagination.data.forEach((item, index, array) => {
              item.images.forEach((img, index, array) => {
                let temp = array[index].src?.includes('https') ? array[index].src!.replace('https', 'http').replace(apiImageUrl, cloudinaryUrl) : array[index].src!.replace(apiImageUrl, cloudinaryUrl);
                array[index].src = temp;

                const filename = array[index].src.substring(array[index].src.lastIndexOf('/') + 1);
                array[index].responsiveSrcSet = this.navService.GetProductResponsiveSrcSet('Products/' + filename);
              });
            });
          }

          return pagination;
        })
      )
      .subscribe({
        next: (response) => {
          this.products = response.data;
          //console.log(response.data);

          //this.products = this.productService.shuffle(this.products);
          //this.paginate = this.productService.getPager(+response.count, +response.pageIndex, +response.pageSize);
        },
        error: (e) => {
          console.error(e);
        },
        //complete: () => { console.info('load related product complete') }
      });
  }

  // getProducts(useCache = false) {
  //   this.productService.getProducts(useCache).subscribe({
  //     next: (response) => {
  //       this.products = response?.data.filter(item => item.productType === this.type);
  //       //this.products = this.productService.shuffle(this.products);

  //       console.log(response?.data);
  //     },
  //     error: (e) => { console.error(e) },
  //     complete: () => { console.info('load related product complete') }
  //   })
  // }
}
