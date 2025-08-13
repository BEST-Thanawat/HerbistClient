import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IProduct } from '../../shared/classes/product';
import { Observable, Subscription, map } from 'rxjs';
import { ProductDetailsMainSlider } from '../../shared/data/slider';
import { ProductDetailsThumbSlider } from '../../shared/data/slider';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { ShopService } from '../../shared/services/shop.service';
import { SeoService } from '../../shared/services/seo.service';
import { IUser } from '../../shared/classes/user';
import { AccountService } from '../../shared/services/account.service';
import { OrderService } from '../../shared/services/order.service';
import { IOrder } from '../../shared/classes/order';
import { IOrderItem } from '../../shared/classes/order';
import { IReview } from '../../shared/classes/review';
import { ToastrTranslateService } from '../../shared/services/toastr-translate.service';
import { AppService } from '../../shared/services/app.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { CategoriesComponent } from "../../shared/components/categories/categories.component";
import { ServicesComponent } from "./widgets/services/services.component";
import { ProductBoxVerticalSliderComponent } from "../../shared/components/product/product-box-vertical-slider/product-box-vertical-slider.component";
import { CarouselModule } from "ngx-owl-carousel-o";
import { DiscountPipe } from "../../shared/pipes/discount.pipe";
import { StockInventoryComponent } from "./widgets/stock-inventory/stock-inventory.component";
import { SocialComponent } from "./widgets/social/social.component";
import { AccordionComponent } from "../../shared/components/accordion/accordion.component";
import { AccordionItemDirective } from "../../shared/components/accordion/directives/accordion-item.directive";
import { RelatedProductComponent } from "./widgets/related-product/related-product.component";
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { AccordionContentDirective } from '../../shared/components/accordion/directives/accordion-content.directive';

@Component({
  selector: 'app-product-left-sidebar',
  imports: [CommonModule, TranslateModule, AccordionContentDirective, TextInputComponent, ReactiveFormsModule, RouterModule, BreadcrumbComponent, CategoriesComponent, ServicesComponent, ProductBoxVerticalSliderComponent, CarouselModule, DiscountPipe, StockInventoryComponent, SocialComponent, AccordionComponent, AccordionItemDirective, RelatedProductComponent],
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss'],
})
export class ProductLeftSidebarComponent implements OnInit, OnDestroy {
  product!: IProduct;
  public counter: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public active = 1;
  public rating: number = 0;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  mobileSideBar: boolean | undefined;
  navigationSubs = new Subscription();
  subscriptionParamMap = new Subscription();

  currentUser$!: Observable<IUser | null>;
  public reviewForm: FormGroup | undefined;
  public canComment: boolean = false;
  public isAlreadyCommented: boolean = false;

  aggregateRatingValue: number = 0;
  aggregateRatingCount: number = 0;
  aggregateBestRating: number = 5;
  aggregateWorstRating: number = 1;

  collapsing = true;

  productSrcset = ''; //'320w, 481w, 672w, 800w, 1000w, 1200w'; //1400w
  productSizes = '70vw';
  descSrcset = ''; //'320w, 481w, 672w, 800w';
  descSizes = '20vw';

  constructor(
    private tts: ToastrTranslateService,
    private appService: AppService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private seoService: SeoService,
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private cartService: CartService,
    private shopService: ShopService
  ) {
    if (this.appService.isBrowser()) {
      this.subscriptionParamMap = this.route.paramMap.subscribe((paramMap) => {
        //console.log();
        this.loadProduct(paramMap.get('id')!);
      });

      this.navigationSubs = this.shopService.getMobileSidebar().subscribe({
        next: (value: boolean) => {
          //console.log(value);
          this.mobileSideBar = value;
        },
      });

      this.createReviewForm();
      this.shopService.setShowFooter(false);
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.navigationSubs.unsubscribe();
    this.shopService.setMobileSidebar(false);
    this.subscriptionParamMap.unsubscribe();
  }

  loadProduct(id: string) {
    //this.productService.getProductDetail(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
    this.productService
      .getProductDetail(Number(id))
      .pipe(
        map((product) => {
          if (environment.cloudinary === true) {
            let imageUrl = environment.apiUrl.replace('api/', '');
            if (imageUrl.includes('https')) {
              imageUrl = imageUrl.replace('https', 'http');
            }
            let apiImageUrl = imageUrl + 'Content/images/products/';
            let cloudinaryUrl = environment.cloudinaryURL + '/' + environment.cloudinaryId + '/Products/';
            // console.log(apiImageUrl);
            console.log(product);

            product.images.forEach((item, index, array) => {
              // console.log(array[index].src);
              let temp = array[index].src?.includes('https')
                ? array[index]
                    .src!.replace('https', 'http')
                    .replace(apiImageUrl, cloudinaryUrl)
                : array[index].src!.replace(apiImageUrl, cloudinaryUrl);
              array[index].src = temp;
              console.log(array[index].src);
            });
          }

          return product;
        })
      )
      .subscribe({
        next: (product: IProduct) => {
          // Get current user
          this.currentUser$ = this.accountService.currentUser$;
          this.currentUser$.subscribe({
            next: (user: any) => {
              if (user) {
                let isCommented = product.reviews.find(
                  (email) => email.buyerEmail === user.email
                );
                if (isCommented) this.isAlreadyCommented = true;

                this.getOrders();
                this.reviewForm!.get('rating')!.patchValue('5');
                this.reviewForm!.get('rating')!.markAsTouched();
                this.reviewForm!.get('name')!.patchValue(user.displayName);
                this.reviewForm!.get('email')!.patchValue(user.email);
                this.reviewForm!.get('name')!.markAsTouched();
                this.reviewForm!.get('email')!.markAsTouched();
              }
            },
            error: (e: any) => {
              console.log(e);
            },
          });

          //console.log(product.images)
          this.product = product;
          const params = this.productService.getShopParams();
          params.typeId = this.product.productTypeId;
          this.productService.setShopParams(params);

          //Cannot use Image on Angular Universal SSR side
          //let productImage = new Image();
          //productImage.src = product.images[0].src!;
          //console.log(product.images[0].src);
          this.seoService.setProductPageTags(product, product.images[0].src!);
          //console.log(product.reviews);

          this.CalculateRatingAndAddProductSnippets();
        },
        error: (e) => {
          console.error(e);
        },
        complete: () => {
          //console.info('load a product complete');
          this.shopService.scrollToTop();
          this.shopService.setShowFooter(true);
        },
      });
  }

  private GenerateProductSnippets(product: IProduct) {
    let reviewArray: {
      '@type': string;
      reviewRating: {
        '@type': string;
        ratingValue: number;
        bestRating: number;
        worstRating: number;
      };
      author: { '@type': string; name: string };
    }[] = [];
    product.reviews.forEach((review) => {
      let tempReview = {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: this.aggregateBestRating,
          worstRating: this.aggregateWorstRating,
        },
        author: {
          '@type': 'Person',
          name: review.buyerName,
        },
      };
      reviewArray.push(tempReview);
      //console.log(reviewArray);
    });
    this.AddProductSnippet(
      product,
      product.images[0].src!,
      reviewArray,
      this.aggregateRatingValue,
      this.aggregateRatingCount
    );
  }

  private CalculateRatingAndAddProductSnippets() {
    this.aggregateRatingValue = 0;
    this.aggregateRatingCount = 0;

    const sumRating =
      this.product.reviews.reduce((a, b) => b.rating + a, 0) /
      this.product.reviews.length;
    if (sumRating) {
      const ratingAvg = this.round(sumRating, 0.5);
      this.rating = ratingAvg;

      this.aggregateRatingValue = ratingAvg;
      this.aggregateRatingCount = this.product.reviews.length;
      this.GenerateProductSnippets(this.product);
    }
  }

  round(value: number, step: number) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  }

  updateFilter() {
    this.router.navigate(['/shop/collection/left/sidebar']);
  }

  // // Get Product Color
  // Color(variants: any) {
  //   const uniqColor = []
  //   for (let i = 0; i < Object.keys(variants).length; i++) {
  //     if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
  //       uniqColor.push(variants[i].color)
  //     }
  //   }
  //   return uniqColor
  // }

  // // Get Product Size
  // Size(variants: any) {
  //   const uniqSize = []
  //   for (let i = 0; i < Object.keys(variants).length; i++) {
  //     if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
  //       uniqSize.push(variants[i].size)
  //     }
  //   }
  //   return uniqSize
  // }

  // selectSize(size: any) {
  //   this.selectedSize = size;
  // }

  // Increament
  increment() {
    this.counter++;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter--;
  }

  // Add to cart
  async addToCart(product: IProduct) {
    this.cartService.addItemToCart(product, this.counter);
  }

  // Buy Now
  async buyNow(product: IProduct) {
    this.cartService.addItemToCart(product, this.counter);
    this.router.navigate(['/checkout']);
  }

  // buyNow(product: IProduct) {
  //   window.dispatchEvent(new Event('resize'));
  // }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.shopService.setMobileSidebar(!this.mobileSideBar);
  }

  AddProductSnippet(
    product: IProduct,
    productImageURL: string,
    reviewsArray: any,
    aggregateRatingValue: number,
    aggregateRatingCount: number
  ) {
    //console.log(productImage.src);
    this.seoService.emptyJsonSnippet();
    this.seoService.updateJsonSnippet({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      sku: product.id,
      //gtin14: "12345678901234",
      image: [productImageURL],
      name: product.name,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: product.productBrand,
      },
      offer: {
        '@type': 'Offer',
        url: 'https://herbist.shop/shop/product/' + product.id,
        itemCondition: 'https://schema.org/NewCondition',
        availability:
          product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        price: product.price,
        priceCurrency: 'THB',
        //priceValidUntil: "2020-11-20",
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '50',
            currency: 'THB',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'TH',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: '0',
              maxValue: '1',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: '1',
              maxValue: '5',
            },
          },
        },
      },
      review: [reviewsArray],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRatingValue,
        reviewCount: aggregateRatingCount,
        bestRating: this.aggregateBestRating,
        worstRating: this.aggregateWorstRating,
      },
    });
  }

  createReviewForm() {
    this.reviewForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      text: [null, [Validators.required]],
      rating: [null, [Validators.required]],
    });
  }

  onSubmit() {
    // this.ngxLoader.startLoader('loader-01');
    let newReview: IReview = {
      productId: this.product.id,
      buyerEmail: this.reviewForm!.get('email')?.value,
      buyerName: this.reviewForm!.get('name')?.value,
      rating: this.reviewForm!.get('rating')?.value,
      text: this.reviewForm!.get('text')?.value,
      reviewDate: new Date(),
    };
    //console.log(newReview)

    this.shopService.submitNewReview(newReview).subscribe({
      next: (response: any) => {
        this.loadProduct(newReview.productId.toString());
      },
      error: (e) => {
        // this.ngxLoader.stopLoader('loader-01');
        console.error(e);
      },
      complete: () => {
        this.tts.success('Save Product Review Successfully');
        // this.ngxLoader.stopLoader('loader-01');
      },
    });
  }

  onRatingChange(event: any) {
    //console.log(event.value);
    this.reviewForm!.get('rating')!.patchValue(event.value);
    this.reviewForm!.get('rating')!.markAsTouched();
  }

  blindEmail(email: string) {
    let addIndex = email.indexOf('@');
    return (
      email.substring(0, addIndex - 5) +
      '...' +
      email.substring(addIndex, email.length)
    );
  }

  getOrders() {
    //let isAlreadyCommented = this.product.reviews.
    this.orderService.getSuccessOrderForUser().subscribe({
      next: (orders: IOrder[] | any) => {
        if (orders) {
          //this.orders = orders;
          orders.forEach((order: IOrder) => {
            order.orderItems.forEach((item: IOrderItem) => {
              if (item.productId === this.product.id) this.canComment = true;
            });
          });
          //console.log(orders[0].orderItems);
        }
      },
      error: (e) => {
        console.error(e);
      },
      //complete: () => { this.toastr.success('Your account has been successfully created'); }
    });
  }
}
