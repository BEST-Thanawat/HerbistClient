import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SeoService } from '../../shared/services/seo.service';
import { ShopService } from '../../shared/services/shop.service';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { ICart, ICartItem } from '../../shared/classes/cart';
import { ICartTotals } from '../../shared/classes/cart';
import { IProduct } from '../../shared/classes/product';
import { environment } from '../../../environments/environment';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../shared/services/app.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DiscountPipe } from '../../shared/pipes/discount.pipe';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule, DiscountPipe, BreadcrumbComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart$!: Observable<ICart | null>;
  cartTotals$!: Observable<ICartTotals | null>;

  public products: IProduct[] = [];

  sizes = '10vw';
  srcset = ''; //'160w, 200w, 320w, 481w, 672w, 800w, 1000w, 1200w';

  constructor(
    private translate: TranslateService,
    private ccService: NgcCookieConsentService,
    private seoService: SeoService,
    public cartService: CartService,
    public productService: ProductService,
    private shopService: ShopService,
    private appService: AppService,
    private analyticsService: AnalyticsService
  ) {
    this.cart$ = this.cartService.cart$.pipe(
      map((cart: ICart | any) => {
        if (environment.cloudinary === true) {
          let imageUrl = environment.apiUrl.replace('api/', '');
          if (imageUrl.includes('https')) {
            imageUrl = imageUrl.replace('https', 'http');
          }
          let apiImageUrl = imageUrl + 'Content/images/products/';
          let cloudinaryUrl = environment.cloudinaryURL + '/' + environment.cloudinaryId + '/Products/';

          if (cart !== null) {
            cart.items.forEach((product: ICartItem, index: number, array: ICartItem[]) => {
              let temp = array[index].pictureUrl?.includes('https') ? array[index].pictureUrl!.replace('https', 'http').replace(apiImageUrl, cloudinaryUrl) : array[index].pictureUrl!.replace(apiImageUrl, cloudinaryUrl);
              array[index].pictureUrl = temp;
            });
          }
        }

        return cart;
      })
    );
    this.cartTotals$ = this.cartService.cartTotals$;
    this.shopService.setShowFooter(true);
  }

  ngOnInit(): void {
    this.seoService.setNormalPageTags('Cart(ตะกร้า) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.shopService.scrollToTop();
    this.cartService.clearShippingPrice();

    // this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(() => {
    // });

    // this.popupCloseSubscription = this.ccService.popupClose$.subscribe(() => {
    // });

    // this.initializeSubscription = this.ccService.initializing$.subscribe((event: NgcInitializingEvent) => {
    // });

    // this.statusChangeSubscription = this.ccService.statusChange$.subscribe((event: NgcStatusChangeEvent) => {
    // });

    // this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(() => {
    // });

    // this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe((event: NgcNoCookieLawEvent) => {
    // });

    if (this.appService.isBrowser()) {
      this.translate.get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy']).subscribe((data) => {
        this.ccService.getConfig().content = this.ccService.getConfig().content || {};
        // Override default messages with the translated ones
        this.ccService.getConfig().content!.header = data['cookie.header'];
        this.ccService.getConfig().content!.message = data['cookie.message'];
        this.ccService.getConfig().content!.dismiss = data['cookie.dismiss'];
        this.ccService.getConfig().content!.allow = data['cookie.allow'];
        this.ccService.getConfig().content!.deny = data['cookie.deny'];
        this.ccService.getConfig().content!.link = data['cookie.link'];
        this.ccService.getConfig().content!.policy = data['cookie.policy'];

        this.ccService.destroy(); //remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig()); // update config with translated messages
      });
    }
  }

  // public get getTotal(): Observable<ICartTotals> {
  //   return this.cartTotals$;
  // }

  // Increament
  increment(product: any, qty = 1) {
    this.cartService.incrementItemQuantity(product);
  }

  // Decrement
  decrement(product: any, qty = -1) {
    this.cartService.decrementItemQuantity(product);
  }

  public removeItem(product: any) {
    this.cartService.removeItemFromCart(product);
  }
}
