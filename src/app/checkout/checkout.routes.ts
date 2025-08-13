import { Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { CheckoutBillingAddressComponent } from './checkout-billing-address/checkout-billing-address.component';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { CheckoutStartComponent } from './checkout-start/checkout-start.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';

export const checkout: Routes = [
  {
    path: 'checkout-address',
    component: CheckoutAddressComponent,
  },
  {
    path: 'checkout-billing-address',
    component: CheckoutBillingAddressComponent,
  },
  {
    path: 'checkout-delivery',
    component: CheckoutDeliveryComponent,
  },
  {
    path: 'checkout-payment',
    component: CheckoutPaymentComponent,
  },
  {
    path: 'checkout-success',
    component: CheckoutSuccessComponent,
  },
  {
    path: '',
    component: CheckoutStartComponent,
  },
];
