import { Component, OnInit, PipeTransform, Pipe, forwardRef, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../services/app.service';
import { ProductService } from '../../services/product.service';
import { ShopParams } from '../../classes/shopParams';
import { Product } from '../../classes/product';
import { CartService } from '../../services/cart.service';
import { ICart } from '../../classes/cart';
import { ICartItem } from '../../classes/cart';
import { ICartTotals } from '../../classes/cart';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, TranslateModule, RouterModule, ReactiveFormsModule, forwardRef(() => SumPipe)],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  searchImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/icon/search.png' : 'assets/images/icon/search.png';
  cartImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/icon/cart.png' : 'assets/images/icon/cart.png';
  sizes = '10vw';
  srcset = ''; //'160w, 200w, 320w, 481w, 672w, 800w, 1000w, 1200w';

  cart$!: Observable<ICart | null>;
  cartTotals$!: Observable<ICartTotals | null>;
  //totalItems: number | undefined;

  public products: Product[] = [];
  public search: boolean = false;

  public languages = [
    {
      class: 'flag:US',
      name: 'English',
      code: 'en',
    },
    {
      class: 'flag:TH',
      name: 'Thai',
      code: 'th',
    },
  ];

  public currencies = [
    {
      name: 'Euro',
      currency: 'EUR',
      price: 0.9, // price of euro
    },
    {
      name: 'Rupees',
      currency: 'INR',
      price: 70.93, // price of inr
    },
    {
      name: 'Pound',
      currency: 'GBP',
      price: 0.78, // price of euro
    },
    {
      name: 'Dollar',
      currency: 'USD',
      price: 1, // price of usd
    },
  ];

  public searchForm: FormGroup | undefined;

  constructor(
    private renderer: Renderer2,
    private formBuilder: UntypedFormBuilder,
    private navService: NavService,
    private translate: TranslateService,
    public productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private appService: AppService
  ) {
    //this.cartService.getCart().subscribe(response => this.products = response);

    this.createSearchForm();
  }

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$.pipe(
      map((cart: ICart | any) => {
        if (environment.cloudinary === true) {
          let imageUrl = environment.apiUrl.replace('api/', '');
          if (imageUrl.includes('https')) {
            imageUrl = imageUrl.replace('https', 'http');
          }
          let apiImageUrl = imageUrl + 'Content/images/products/';
          let cloudinaryUrl = environment.cloudinaryId + '/Products/';

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
    //??? this.cart$.subscribe({
    //   next: (cartTotal: any) => {
    //     if (cartTotal) {
    //       this.totalItems = cartTotal.length;
    //     }
    //   },
    //   error: (e: any) => { console.log(e); }
    // })
  }

  searchToggle() {
    this.search = !this.search;
  }

  changeLanguage(code: any) {
    if (this.appService.isBrowser()) {
      this.translate.use(code);

      this.navService.setLanguage();
    }
  }

  // get getTotal(): Observable<number> {
  //   return this.productService.cartTotalAmount();
  // }

  removeItem(product: any) {
    this.cartService.removeItemFromCart(product);
  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency;
  }

  createSearchForm() {
    this.searchForm = this.formBuilder.group({
      search: [null, [Validators.required]],
    });
  }

  onSubmit() {
    const params = new ShopParams();
    params.search = this.searchForm!.controls['search'].value;
    //console.log(params.search);
    this.productService.setShopParams(params);

    this.router.navigateByUrl('/', { onSameUrlNavigation: 'reload' }).then(() => {
      this.router.navigate(['/shop/collection/left/sidebar']);
    });

    this.searchToggle();
  }
}

@Pipe({
  name: 'sum',
})
export class SumPipe implements PipeTransform {
  transform(items: ICartItem[], attr: string): number {
    if (attr == 'quantity') {
      return items.reduce((a, b) => a + b[attr], 0);
    }

    return 0;
  }
}
