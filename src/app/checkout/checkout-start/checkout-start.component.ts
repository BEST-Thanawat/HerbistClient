import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { AccountService } from '../../shared/services/account.service';
import { ShopService } from '../../shared/services/shop.service';
import { SeoService } from '../../shared/services/seo.service';
import { ToastrTranslateService } from '../../shared/services/toastr-translate.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { ICart, ICartTotals } from '../../shared/classes/cart';
import { IDeliveryMethod } from '../../shared/classes/deliveryMethod';
import { IUser } from '../../shared/classes/user';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { StepperComponent } from "../widgets/stepper/stepper.component";
import { CheckoutPaymentComponent } from "../checkout-payment/checkout-payment.component";
import { CheckoutDeliveryComponent } from "../checkout-delivery/checkout-delivery.component";
import { CheckoutAddressComponent } from "../checkout-address/checkout-address.component";
import { CheckoutBillingAddressComponent } from "../checkout-billing-address/checkout-billing-address.component";

@Component({
  selector: 'app-checkout-start',
  imports: [ReactiveFormsModule, CdkStepperModule, RouterModule, TranslateModule, CommonModule, BreadcrumbComponent, StepperComponent, CheckoutPaymentComponent, CheckoutDeliveryComponent, CheckoutAddressComponent, CheckoutBillingAddressComponent],
  templateUrl: './checkout-start.component.html',
  styleUrls: ['./checkout-start.component.scss']
})
export class CheckoutStartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('appStepper') stepper: CdkStepper | undefined;
  stepperCDK: CdkStepper | undefined;

  freeShippingCondition: number = environment.freeShippingCondition;
  public checkoutForm: FormGroup | undefined;
  public paymentForm: FormGroup | undefined;
  //public products: IProduct[] = [];
  // public payPalConfig ? : IPayPalConfig;
  public amount: any;
  cartId: string | undefined;
  obsCart: any;
  cart$: Observable<ICart | null> = new Observable<ICart | null>();
  cartTotals$!: Observable<ICartTotals | null>;
  shippingPrice$!: Observable<number | null>;
  couponDiscount$!: Observable<number | null>;
  total: number | undefined;
  deliveryMethods!: IDeliveryMethod[];
  deliveryMethodsId: number = 1;
  deliveryMethodName: string | undefined;
  //deliveryMethods$!: Observable<IDeliveryMethod[] | null>;
  spinnerStatus: boolean = false;
  currentUser$!: Observable<IUser | null>;

  isUsedBillingAddress: boolean = false;
  address: string = "1 Address";
  billing: string = "2 Billing";
  shipping: string = "3 Shipping";
  payment: string = "4 Payment";

  cartTotalDiscount$!: Observable<number>;
  finalShippingPrice$!: Observable<string>;
  public stepperIndex: number = 0;
  sentGA: boolean = false;

  constructor(private tts: ToastrTranslateService, private seoService: SeoService, public cdRef: ChangeDetectorRef, private fb: UntypedFormBuilder, public productService: ProductService, private cartService: CartService,
    private accountService: AccountService, private shopService: ShopService, private analyticsService: AnalyticsService) { 
    this.shopService.setShowFooter(true);
  }

  ngOnInit(): void {
    this.seoService.setNormalPageTags('Checkout(เช็กเอาต์) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.shopService.scrollToTop();
    //Load default CDKStepper language
    this.address = this.tts.getTranslate('1 Address');
    this.billing = this.tts.getTranslate('2 Billing');
    this.shipping = this.tts.getTranslate('3 Shipping');
    this.payment = this.tts.getTranslate('4 Payment');

    // this.translate.get(['1 Address', '2 Billing', '3 Shipping', '4 Payment']).subscribe(translations => {
    //   this.address = translations['1 Address'];
    //   this.billing = translations['2 Billing'];
    //   this.shipping = translations['3 Shipping'];
    //   this.payment = translations['4 Payment'];
    // });

    //Change CDKStepper language when language changed
    this.tts.onLangChange().subscribe((event: LangChangeEvent) => {
      this.address = this.tts.getTranslate('1 Address');
      this.billing = this.tts.getTranslate('2 Billing');
      this.shipping = this.tts.getTranslate('3 Shipping');
      this.payment = this.tts.getTranslate('4 Payment');
    });

    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   //console.log('onLangChange', event);
    //   this.translate.get(['1 Address', '2 Billing', '3 Shipping', '4 Payment']).subscribe(translations => {
    //     this.address = translations['1 Address'];
    //     this.billing = translations['2 Billing'];
    //     this.shipping = translations['3 Shipping'];
    //     this.payment = translations['4 Payment'];
    //   });
    // });

    this.createCheckoutForm();
    this.createPaymentForm();
    this.getCartAndTotal();
    this.cartService.clearCouponDiscount();

    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe();

    // this.isHaveDiscount$ = this.cartTotals$.pipe(
    //   withLatestFrom(this.couponDiscount$),
    //   map(([cartTotal, couponDC]) => {
    //     console.log(couponDC)
    //     return (cartTotal?.discount !== 0 || couponDC !== 0) ? true : false;
    //   })
    // );

    this.cartTotalDiscount$ = this.cartTotals$.pipe(
      map((total: any) => {
        //console.log(total);
        return total ? total.discount : 0;
      })
    );

    this.finalShippingPrice$ = this.shippingPrice$.pipe(
      map((price: any) => {
        //console.log(price);
        return price;
      })
    );

    //this.shopService.setShowFooter(true);
  }

  ngOnDestroy(): void {
    this.obsCart.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    this.stepperCDK = this.stepper;
  }

  onStepChange(event: any): void {
    this.shopService.setStepperIndex(event.selectedIndex);
    this.stepperIndex = event.selectedIndex;
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        company: [null],
        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        phone: [null, [Validators.required, Validators.pattern("^[0]\\d{2}-\\d{3}-\\d{4}$")]],
        email: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
        address: [null, [Validators.required]],
        country: ['disabled: true', Validators.required],
        town: [null, Validators.required],
        province: [null, Validators.required],
        postalcode: [null, [Validators.required, Validators.pattern('[0-9]{5}')]],
        additionalMessage: [null],
      }),
      billingForm: this.fb.group({
        b_company: [null],
        b_firstname: [null, [Validators.required]],
        b_lastname: [null, [Validators.required]],
        b_phone: [null, [Validators.required, Validators.pattern("^[0]\\d{2}-\\d{3}-\\d{4}$")]],
        b_email: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
        b_address: [null, [Validators.required]],
        b_country: ['disabled: true', Validators.required],
        b_town: [null, Validators.required],
        b_province: [null, Validators.required],
        b_postalcode: [null, [Validators.required, Validators.pattern('[0-9]{5}')]],
      }),
      deliveryForm: this.fb.group({
        shippingmethodid: [null, Validators.required],
      }),
      paymentForm: this.fb.group({
        paymentmethodid: [null, Validators.required],
        nameOnCard: [null],
        couponCode: [null]
      })
    });
  }

  createPaymentForm() {
    this.paymentForm = this.fb.group({
      nameOnCard: [null, Validators.required]
    });
  }

  private getCartAndTotal() {
    this.cart$ = this.cartService.cart$;
    this.cartTotals$ = this.cartService.cartTotals$;
    this.shippingPrice$ = this.cartService.shippingPrice$;
    this.couponDiscount$ = this.cartService.couponDiscount$;

    this.obsCart = combineLatest([this.cartTotals$, this.cart$]).subscribe(([cartTotal, cart]) => {
      if (cart) {
        this.cartId = cart.id;

        if (this.cartService.deliveryMethods!.find(x => x.id == cart.deliveryMethodId)!) {
          this.deliveryMethodName = this.cartService.deliveryMethods!.find(x => x.id == cart.deliveryMethodId)!.shortName;
        } else {
          this.deliveryMethodName = "";
        }

        // Send event to GA
        if (!this.sentGA) {
          this.sentGA = true;
          this.analyticsService.eventBeginCheckout(cart!, cartTotal?.total!);
        }
      }
    });

    // this.cart$.subscribe({
    //   next: (cart: ICart | null) => {
    //     if (cart) {
    //       this.cartId = cart.id;
    //       //console.log(this.cartId);
    //       //console.log(this.cartService.deliveryMethods);
    //       if (this.cartService.deliveryMethods!.find(x => x.id == cart.deliveryMethodId)!) {
    //         this.deliveryMethodName = this.cartService.deliveryMethods!.find(x => x.id == cart.deliveryMethodId)!.shortName;
    //       } else {
    //         this.deliveryMethodName = "";
    //       }

    //       // Send data to GA
    //       // const getTotal = this.cartTotals$.pipe(
    //       //   map(val => val?.total)
    //       // );
    //       // const getCart = this.cart$.pipe(map(val => val))
    //       // getTotal.subscribe((total) => {
    //       //   getCart.subscribe((cart) => {
    //       //     this.analyticsService.eventBeginCheckout(cart!, total!);
    //       //   })
    //       //   //this.analyticsService.eventBeginCheckout(getCart, total!);
    //       // });
          
    //     }
    //   },
    //   error: (e: any) => { console.log(e); }
    // });
  }
}
