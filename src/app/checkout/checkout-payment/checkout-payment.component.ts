import { AfterViewInit, ChangeDetectorRef, Component, importProvidersFrom, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { IAddress } from '../../shared/classes/address';
import { ICouponToReturnDto } from '../../shared/classes/coupon';
import { IOrder, OrderStatus } from '../../shared/classes/order';
import { ToastrTranslateService } from '../../shared/services/toastr-translate.service';
import { IBankAccount } from '../../shared/classes/bankAccount';
import { ICart } from '../../shared/classes/cart';
import { IOrderToCreate } from '../../shared/classes/order';
import { IPaymentMethod } from '../../shared/classes/paymentMethod';
import { CartService } from '../../shared/services/cart.service';
import { OrderService } from '../../shared/services/order.service';
import { ShopService } from '../../shared/services/shop.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmComponent } from '../widgets/confirm/confirm.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppService } from '../../shared/services/app.service';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionItemDirective } from '../../shared/components/accordion/directives/accordion-item.directive';
import { TextCreditcardComponent } from '../widgets/text-creditcard/text-creditcard.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { AccordionContentDirective } from '../../shared/components/accordion/directives/accordion-content.directive';

@Component({
  selector: 'app-checkout-payment',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, AccordionComponent, AccordionItemDirective, TextCreditcardComponent, CdkStepperModule, AccordionContentDirective],
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() checkoutForm!: FormGroup;
  @Input() cartId!: string;
  @Input() email!: string;
  @ViewChild('couponAccordion') couponAccordion: AccordionComponent | undefined;

  paymentMethods: IPaymentMethod[] | undefined;
  bankAccounts: IBankAccount[] | undefined;

  paymentMethodsId: number | undefined;

  public payment: string = 'direct_transfer';

  loading = false;
  stripe: any;
  ccNumber: string | undefined;
  stripeInstance: any;

  cardSubs = new Subscription();
  isValid = false;
  couponError = true;
  couponErrorMessage: string = '';
  usedCoupon = false;
  couponDesc: string = '';

  isOpen = false;

  modalRef?: BsModalRef;
  modalLoadingRef?: BsModalRef;

  collapsing = true;

  constructor(
    private tts: ToastrTranslateService,
    private ref: ChangeDetectorRef,
    private appService: AppService,
    private modalService: BsModalService,
    private cartService: CartService,
    public shopService: ShopService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cardSubs = this.shopService.getCardValidated().subscribe();
  }

  ngOnInit(): void {
    if (this.appService.isBrowser()) {
      this.getBankAccounts();
      this.getPaymentMethods();
    }
  }

  ngOnDestroy(): void {
    this.cardSubs.unsubscribe();
    this.shopService.setMobileSidebar(false);
  }

  ngAfterViewInit(): void {}

  getCCNumber(value: any) {
    this.ccNumber = value;
    //console.log(this.ccNumber);
  }

  getStripeInstance(value: any) {
    this.stripeInstance = value;
    //console.log(this.stripeInstance);
  }

  setPaymentMethod(id: number) {
    //console.log('setPaymentMethod');
    //console.log(id);
    this.paymentMethodsId = id;
    this.checkoutForm.get('paymentForm')?.get('paymentmethodid')?.patchValue(id.toString());
    if (this.paymentMethodsId === 0) {
      this.tts.error('Payment method error!');
      return;
    }

    if (this.paymentMethodsId == 1) {
      //this.disabledSubmit = false;
    } else if (this.paymentMethodsId == 2 && this.checkoutForm.get('paymentForm')?.get('shippingmethodid')?.value !== '') {
      //this.disabledSubmit = true;
      this.createPaymentIntent();
    }
  }

  createPaymentIntent() {
    // console.log(this.cartId);
    this.cartService.createPaymentIntent(this.cartId).subscribe({
      next: () => {
        //this.toastr.success('PaymentIntent Created');
      },
      error: (e) => {
        console.error(e);
        this.cartService.deleteCartById(this.cartId);
        this.tts.error('Cart error!! Please try checkout again');

        this.router.navigate(['/shop/cart']);
      },
      // complete: () => { this.toastr.success('Your account has been successfully created'); }
    });
  }

  getPaymentMethods() {
    //this.paymentMethods = this.shopService.paymentMethods;
    this.shopService.getPaymentMethods().subscribe({
      next: (methods: IPaymentMethod[]) => {
        this.paymentMethods = methods;
      },
      error: (e) => {
        console.error(e);
      },
      // complete: () => { this.toastr.success('Your account has been successfully created'); }
    });
  }

  getBankAccounts() {
    this.shopService.getBankAccounts().subscribe({
      next: (methods: IBankAccount[]) => {
        this.bankAccounts = methods;
        //console.log(this.bankAccounts);
      },
      error: (e) => {
        console.error(e);
      },
      // complete: () => { this.toastr.success('Your account has been successfully created'); }
    });
  }

  clearPaymentMethod() {
    if (this.couponAccordion?.getState(0) === 1) this.couponAccordion.toggleState(0);
    this.paymentMethodsId = 0;
    this.isValid = false;
    this.couponError = false;
    this.couponErrorMessage = '';
    this.usedCoupon = false;
    this.clearShippingMethod();
    this.cartService.clearCouponDiscount();
    this.checkoutForm.get('paymentForm')?.get('couponCode')?.patchValue('');
    this.checkoutForm.get('paymentForm')?.get('paymentmethodid')?.patchValue(0);
    this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.patchValue('');
    this.checkoutForm.get('paymentForm')?.setErrors({ invalid: true });
    this.checkoutForm.get('paymentForm')?.updateValueAndValidity();
    this.checkoutForm.get('paymentForm')?.get('couponCode')?.markAsUntouched();
  }

  clearShippingMethod() {
    this.checkoutForm!.get('deliveryForm')?.get('shippingmethodid')?.patchValue('');
    this.cartService.clearShippingPrice();
  }

  async submitOrder() {
    const cart = this.cartService.getCurrentCartValue();
    //console.log(cart);

    if (this.paymentMethodsId == 1) {
      this.modalRef = this.modalService.show(ConfirmComponent);
      this.modalRef.content.onClose.subscribe(async (result: any) => {
        if (result) {
          // Confirm create order
          //console.log('Direct Transfer');
          // this.ngxLoader.startLoader('loader-01');

          this.modalLoadingRef = this.modalService.show(LoadingComponent, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });

          //var spinnerRef = this.dialogService.start(this.tts.getTranslate('Processing Order...'));
          this.loading = true;
          try {
            const createdOrder = await this.createOrder(cart);

            if (createdOrder) {
              const navigationExtras: NavigationExtras = { state: createdOrder };
              this.router.navigate(['/checkout/checkout-success'], navigationExtras);
              this.cartService.deleteCart(cart!);
            } else {
              //this.toastr.error(paymentResult.error.message);
            }
            this.loading = false;
            this.modalLoadingRef.hide();
            //this.dialogService.stop(spinnerRef);
            // this.ngxLoader.stopLoader('loader-01');
          } catch (error) {
            console.log(error);
            this.loading = false;
            this.modalLoadingRef.hide();
            //this.dialogService.stop(spinnerRef);
            // this.ngxLoader.stopLoader('loader-01');
          }
        } else {
          // Cancel order do nothing
        }
      });
    } else if (this.paymentMethodsId == 2) {
      this.modalLoadingRef = this.modalService.show(LoadingComponent, {
        class: 'modal-sm modal-dialog-centered',
        ignoreBackdropClick: true,
      });
      this.loading = true;

      try {
        const name = this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value;

        /////////////////////////////////////////////////////////////////////////////////// Herbist Server side
        // 1️⃣ Create pending order in backend => On our APIs server
        const createdOrder = await this.createOrder(cart);
        /////////////////////////////////////////////////////////////////////////////////// End Herbist Server side

        /////////////////////////////////////////////////////////////////////////////////// Stripe Client side
        // 2️⃣ Confirm payment with Stripe => On Stripe server
        const paymentResult = await this.shopService.confirmPaymentWithStripe(cart, this.email, this.stripeInstance, this.ccNumber, name);
        // console.log(paymentResult);
        // console.log(paymentResult.paymentIntent);
        // console.log(paymentResult.error);

        if (!paymentResult?.paymentIntent) {
          throw new Error(paymentResult?.error?.message || 'Payment could not be confirmed');
        }
        /////////////////////////////////////////////////////////////////////////////////// End Stripe Client side

        /////////////////////////////////////////////////////////////////////////////////// Herbist Server side
        if (paymentResult?.paymentIntent.status == 'succeeded') {
          // 3️⃣ Poll backend until webhook updates order status
          const order = await this.fetchPaymentStatus(cart?.paymentIntentId!);

          // 4️⃣ Success handling
          this.tts.success('Your payment is processed successfully');
          this.cartService.deleteCart(cart!);
          this.router.navigate(['/checkout/checkout-success'], { state: order });
        }
        /////////////////////////////////////////////////////////////////////////////////// End Herbist Server side
      } catch (error: any) {
        // Handle fail/timeout/API error
        this.tts.error(error.message || 'Payment failed');
        console.error(error);
      } finally {
        // Always stop loading spinner
        this.loading = false;
        this.modalLoadingRef.hide();
      }
    }
  }

  async fetchPaymentStatus(paymentIntentId: string, timeoutMs = 20000, intervalMs = 2000): Promise<IOrder> {
    const start = Date.now();

    while (true) {
      try {
        const order = await firstValueFrom(this.orderService.checkingPaymentStatus(paymentIntentId));

        const status = Number(order.status); // convert string → number

        // ✅ Success
        if (status === 2) {
          order.status = OrderStatus.Processing;
          return order;
        }

        // ❌ Failed payment
        if (status === 3) {
          throw new Error('Payment failed');
        }

        // ⏱ Timeout
        if (Date.now() - start > timeoutMs) {
          throw new Error('Payment status check timed out');
        }
      } catch (err) {
        // Stop immediately if API call itself failed
        throw err;
      }

      // Wait before next poll
      await new Promise((res) => setTimeout(res, intervalMs));
    }
  }

  // sleep(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  private async createOrder(cart: ICart | null) {
    const orderToCreate = this.getOrderToCreate(cart);
    //console.log(orderToCreate);
    return await firstValueFrom(this.orderService.createOrder(orderToCreate));
  }

  getOrderToCreate(cart: ICart | null): IOrderToCreate {
    const address: IAddress = {
      company: this.checkoutForm.get('addressForm')?.get('company')?.value == null ? '' : this.checkoutForm.get('addressForm')?.get('company')?.value,
      firstName: this.checkoutForm.get('addressForm')?.get('firstname')?.value,
      lastName: this.checkoutForm.get('addressForm')?.get('lastname')?.value,
      street: this.checkoutForm.get('addressForm')?.get('address')?.value,
      city: this.checkoutForm.get('addressForm')?.get('town')?.value,
      province: this.checkoutForm.get('addressForm')?.get('province')?.value,
      zipCode: this.checkoutForm.get('addressForm')?.get('postalcode')?.value.toString(),
      email: this.checkoutForm.get('addressForm')?.get('email')?.value,
      telephone: this.checkoutForm.get('addressForm')?.get('phone')?.value.toString(),
      additionalMessage: this.checkoutForm.get('addressForm')?.get('additionalMessage')?.value == null ? '' : this.checkoutForm.get('addressForm')?.get('additionalMessage')?.value,

      isBillingAddress: true,
      billing_Company: this.checkoutForm.get('billingForm')?.get('b_company')?.value == null ? '' : this.checkoutForm.get('billingForm')?.get('b_company')?.value,
      billing_FirstName: this.checkoutForm.get('billingForm')?.get('b_firstname')?.value,
      billing_LastName: this.checkoutForm.get('billingForm')?.get('b_lastname')?.value,
      billing_Street: this.checkoutForm.get('billingForm')?.get('b_address')?.value,
      billing_City: this.checkoutForm.get('billingForm')?.get('b_town')?.value,
      billing_Province: this.checkoutForm.get('billingForm')?.get('b_province')?.value,
      billing_ZipCode: this.checkoutForm.get('billingForm')?.get('b_postalcode')?.value.toString(),
      billing_Email: this.checkoutForm.get('billingForm')?.get('b_email')?.value,
      billing_Telephone: this.checkoutForm.get('billingForm')?.get('b_phone')?.value.toString(),
    };

    return {
      cartId: cart!.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm')?.get('shippingmethodid')?.value,
      shipToAddress: address,
      paymentMethodId: +this.checkoutForm.get('paymentForm')?.get('paymentmethodid')?.value,
      couponCode: this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value == null ? '' : this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value,
    };
  }

  onChange(event: any) {}

  onTouched() {}

  onBlur() {
    this.onTouched();

    if (this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value !== '' && this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value !== null) {
      if (this.checkoutForm!.get('paymentForm')!.get('couponCode')!.status == 'VALID' && this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value.length >= 8 && this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value.length <= 12) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    }
  }

  changes(event: Event) {
    this.checkoutForm.get('paymentForm')?.get('couponCode')?.markAsTouched();
    this.couponError = false;
    this.couponErrorMessage = '';
    this.usedCoupon = false;
    this.couponDesc = '';
    this.cartService.clearCouponDiscount();

    if (this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value !== '' && this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value !== null) {
      if (this.checkoutForm!.get('paymentForm')!.get('couponCode')!.status == 'VALID' && this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value.length >= 8 && this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value.length <= 12) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    }
  }

  applyCoupon() {
    let code: string = this.checkoutForm!.get('paymentForm')!.get('couponCode')!.value;
    //console.log(code);
    this.orderService.getCouponByCode(code.toUpperCase()).subscribe({
      next: (coupon: ICouponToReturnDto | any) => {
        if (coupon !== null && coupon !== undefined && coupon.error === '') {
          this.couponError = false;
          this.cartService.setCouponDiscount(coupon.coupon);
          this.usedCoupon = true;
          this.ref.detectChanges();
          this.couponDesc = coupon.coupon.description;
        } else {
          this.couponError = true;
          this.cartService.clearCouponDiscount();
          this.couponErrorMessage = coupon.error;
          this.couponDesc = '';
          this.usedCoupon = false;
          this.ref.detectChanges();
        }
      },
    });
  }
}
