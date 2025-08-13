import { NgModule } from '@angular/core';
import { CartComponent } from './cart/cart.component';
// import { CheckoutAddressComponent } from './checkout/checkout-address/checkout-address.component';
// import { CheckoutBillingAddressComponent } from './checkout/checkout-billing-address/checkout-billing-address.component';
// import { CheckoutDeliveryComponent } from './checkout/checkout-delivery/checkout-delivery.component';
// import { CheckoutPaymentComponent } from './checkout/checkout-payment/checkout-payment.component';
// import { CheckoutComponent } from './checkout/checkout.component';
// import { SuccessComponent } from './checkout/success/success.component';
import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';
import { BrandsComponent } from './collection/widgets/brands/brands.component';
import { GridComponent } from './collection/widgets/grid/grid.component';
import { PaginationComponent } from './collection/widgets/pagination/pagination.component';
import { TagsComponent } from './collection/widgets/tags/tags.component';
import { ProductLeftSidebarComponent } from './product/product-left-sidebar.component';
import { RelatedProductComponent } from './product/widgets/related-product/related-product.component';
import { ServicesComponent } from './product/widgets/services/services.component';
import { SocialComponent } from './product/widgets/social/social.component';
import { StockInventoryComponent } from './product/widgets/stock-inventory/stock-inventory.component';

import {
  NgcCookieConsentConfig,
  NgcCookieConsentModule,
} from 'ngx-cookieconsent';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'herbist.shop',
    //"domain": "localhost"
  },
  position: 'bottom',
  theme: 'classic',
  palette: {
    popup: {
      background: '#565264',
      text: '#ffffff',
      link: '#ffffff',
    },
    button: {
      background: '#ffffff',
      text: '#000',
      border: 'transparent',
    },
  },
  type: 'info',
  content: {
    message:
      'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: 'https://herbist.shop',
    policy: 'Cookie Policy',
  },
};

// @NgModule({
//   declarations: [
//     ProductLeftSidebarComponent,
//     ServicesComponent,
//     SocialComponent,
//     StockInventoryComponent,
//     RelatedProductComponent,
//     CollectionLeftSidebarComponent,
//     GridComponent,
//     PaginationComponent,
//     BrandsComponent,
//     CartComponent,
//     // CheckoutComponent,
//     // SuccessComponent,
//     TagsComponent,
//     // CheckoutPaymentComponent,
//     // CheckoutAddressComponent,
//     // CheckoutDeliveryComponent,
//     // CheckoutBillingAddressComponent,
//     // SpinnerComponent
//   ],
//   imports: [ShopRoutingModule, NgcCookieConsentModule.forRoot(cookieConfig)],
// })
export class ShopModule {}
