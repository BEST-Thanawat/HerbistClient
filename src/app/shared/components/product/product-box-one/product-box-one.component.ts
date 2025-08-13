import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from '../../modal/quick-view/quick-view.component';
import { IProduct } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { DiscountPipe } from "../../../pipes/discount.pipe";

@Component({
  selector: 'app-product-box-one',
  imports: [CommonModule, TranslateModule, RouterModule, DiscountPipe, QuickViewComponent],
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss'],
})
export class ProductBoxOneComponent implements OnInit {
  @Input() product: IProduct | undefined;
  @Input() currency: any; //this.productService.Currency; // Default Currency
  @Input() thumbnail: boolean = false; // Default False
  @Input() onHowerChangeImage: boolean = false; // Default False
  @Input() cartModal: boolean = false; // Default False
  // @Input() loader: boolean = false;
  @Input() sizes: string = '';

  @ViewChild('quickView') QuickView: QuickViewComponent | undefined;

  public ImageSrc: string | undefined;

  public rating: number = 0;
  public isLoggedIn: boolean = false;

  showImg: boolean = true;
  srcset: string = ''; //'160w, 200w, 320w, 481w, 672w, 800w, 1000w, 1200w';

  productSizes = '60vw';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    const userAgent = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      )
    ) {
      this.productSizes = '60vw';
    } else {
      this.productSizes = '20vw';
    }
  }

  ngOnInit(): void {
    this.currency = this.productService.Currency;
    // if(this.loader) {
    //   setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    // }

    //console.log(this.product);
    //Set rating
    const sumRating =
      this.product!.reviews.reduce((a, b) => b.rating + a, 0) /
      this.product!.reviews.length;
    //console.log('sum:' + sumRating);
    if (sumRating) {
      const ratingAvg = this.round(sumRating, 0.5);
      this.rating = ratingAvg;

      //console.log('avg:' + ratingAvg);
    }
  }

  addToCart(product: any) {
    if (product.stock == 0) return;

    this.cartService.addItemToCart(product);
  }

  round(value: number, step: number) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  }

  // // Get Product Color
  // Color(variants: any) {
  //   const uniqColor = [];
  //   for (let i = 0; i < Object.keys(variants).length; i++) {
  //     if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
  //       uniqColor.push(variants[i].color)
  //     }
  //   }
  //   return uniqColor
  // }

  // // Change Variants
  // ChangeVariants(color: any, product: any) {
  //   product.variants.map((item: any) => {
  //     if (item.color === color) {
  //       product.images.map((img: any) => {
  //         if (img.image_id === item.image_id) {
  //           this.ImageSrc = img.src;
  //         }
  //       })
  //     }
  //   })
  // }

  // // Change Variants Image
  // ChangeVariantsImage(src: any) {
  //   this.ImageSrc = src;
  // }
}
