import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from '../../../../environments/environment';
import { ShopService } from '../../../shared/services/shop.service';
import { AppService } from '../../../shared/services/app.service';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";

//declare var Stripe: any;

@Component({
  selector: 'app-text-creditcard',
  templateUrl: './text-creditcard.component.html',
  styleUrls: ['./text-creditcard.component.scss'],
  imports: [TextInputComponent, ReactiveFormsModule]
})

export class TextCreditcardComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() checkoutForm!: FormGroup;
  @Input() paymentMethodsId!: number;
  //@Output() cardValidated = new EventEmitter<boolean>();
  @Output() ccNumber = new EventEmitter<string>();
  @Output() stripeInstance = new EventEmitter<any>();

  @ViewChild('cardNumber', { static: true }) cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement!: ElementRef;
  //stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;

  cardHandler = this.onChange.bind(this);
  loading = false;

  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  constructor(private shopService: ShopService, private appService: AppService) { }

  ngAfterViewInit(): void {
    if (this.appService.isBrowser()) {
      this.importStripe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    if (changes['paymentMethodsId'].currentValue == 2) {
      //Credit Card
      //console.log('Credit Card');
      this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.setValidators([Validators.required]);
      this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.updateValueAndValidity();
      this.shopService.setCardValidated(this.cardNumberValid && this.cardExpiryValid && this.cardCvcValid);
      //this.cardValidated.next(this.cardNumberValid && this.cardExpiryValid && this.cardCvcValid);//.emit(this.cardNumberValid && this.cardExpiryValid && this.cardCvcValid);
      //console.log(this.checkoutForm.get('paymentForm'));
    }
    else if (changes['paymentMethodsId'].currentValue == 1)
    {
      //Direct Transfer
      //console.log('Direct Transfer');      
      this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.patchValue('');
      this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.setValidators(null);
      this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.setErrors(null);
      this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.updateValueAndValidity();
      this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.markAsUntouched();

      if(this.cardNumber) this.cardNumber.clear();
      if(this.cardExpiry) this.cardExpiry.clear();
      if(this.cardCvc) this.cardCvc.clear();
      this.cardNumberValid = false;
      this.cardExpiryValid = false;
      this.cardCvcValid = false;      
      this.shopService.setCardValidated(true);
      //console.log(this.checkoutForm.get('paymentForm'));
    }
  }

  ngOnDestroy(): void {
    if (this.cardNumber) this.cardNumber.destroy();    
    if (this.cardExpiry) this.cardExpiry.destroy();    
    if (this.cardCvc) this.cardCvc.destroy();
  }

  async importStripe() {
    loadStripe.setLoadParameters({advancedFraudSignals: false});
    //console.log(environment.stripe_token);
    const stripe = await loadStripe(environment.stripe_token);

    this.stripeInstance.emit(stripe);

    const elements = stripe!.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);

    this.shopService.getStepperIndex().subscribe({
      next: (index: number) => {
        if (index !== 3 && this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value !== '') {
          //console.log('hit');
          this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.patchValue('');
        }
      }
    })
  }

  onChange(event: any) {
    if (event.error) {
      this.cardErrors = event.error.message;
    }
    else {
      this.cardErrors = null;
    }

    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        this.ccNumber.emit(this.cardNumber);
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }

    this.shopService.setCardValidated(this.cardNumberValid && this.cardExpiryValid && this.cardCvcValid);
    //this.cardValidated.emit(this.cardNumberValid && this.cardExpiryValid && this.cardCvcValid);
  }
}
