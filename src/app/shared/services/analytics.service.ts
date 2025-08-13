import { Injectable } from '@angular/core';
import { DelayedScriptLoader } from '../classes/delayed-script-loader';
import { ICart, ICartItem } from '../classes/cart';
import { AppService } from './app.service';
import { environment } from '../../../environments/environment';
import { IOrder } from '../classes/order';

// interface AnalyticsScript {
//   // addToCart(event: string, action: string, eventProperties: EventProperties): void;
//   // gtag(event: string, page_view: string, eventProperties: EventProperties): void;
//   // identify(userID: UserIdentifier, traits: UserTraits): void;
//   // track(eventID: EventIdentifier, eventProperties: EventProperties): void;
// }

export type UserIdentifier = string | number;
export interface UserTraits {
  [key: string]: any;
}
export type EventIdentifier = string;
export interface EventProperties {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private scriptLoader: DelayedScriptLoader | undefined;
  // private cssLoader: DelayedScriptLoader | undefined;

  constructor(private appService: AppService) {
    //console.log("https://www.googletagmanager.com/gtag/js?id=" + this.environment.ga);
    if (this.appService.isBrowser()) {
      // this.scriptLoader = new DelayedScriptLoader("assets/tag.min.js", (8 * 1000))
      //this.scriptLoader = new DelayedScriptLoader("https://www.googletagmanager.com/gtm.js?id=" + environment.ga, (8 * 1000), );
      //this.scriptLoader = new DelayedScriptLoader('https://www.googletagmanager.com/gtm.js?id=' + environment.tagmanager, (8 * 1000), );
      this.scriptLoader = new DelayedScriptLoader("https://www.googletagmanager.com/gtag/js?id=" + environment.ga, (8 * 1000), );
      // this.cssLoader = new DelayedScriptLoader("styles-late.css", (8 * 1000));
    }
  }

  public activateGtag() {
    this.run((analytics) => {});

    // window.onload = () => {
    //   this.cssLoader?.loadStyle();
    // };
  }
  
  public eventPurchase(order: IOrder, coupon: string, orderNumber: string, value: number, shipping: number) {
    this.run((analytics) => {
      let itemInCart: { item_id: number; item_name: string; price: number; quantity: number; discount: number;}[] = [];
      order.orderItems.forEach(item => {
        //console.log(item);
        itemInCart.push(
          {
            'item_id': item.itemOrdered.productItemId,
            'item_name': item.itemOrdered.productName,
            'price': item.sale ? item.price - (item.price * item.discount! / 100) : item.price,
            'quantity': item.quantity,
            'discount': item.discount
          }
        );
      });
      //console.log(itemInCart);

      // Call gtag function by @types/gtag.js
      if (typeof window !== 'undefined') {
        window.gtag("event", "purchase", {
          transaction_id: orderNumber,
          value: value,
          tax: 0,
          shipping: shipping,
          currency: "THB",
          coupon: coupon,
          items: itemInCart
        });
      }

      this.conversionADS(orderNumber, value);
    });
  }

  public eventAddToCart(product: ICartItem) {
    this.run((analytics) => {
      // Call gtag function by @types/gtag.js
      if (typeof window !== 'undefined') {
        window.gtag("event", "add_to_cart", {
          currency: "THB",
          value: product.sale ? (product.price - (product.price * product.discount! / 100)) * product.quantity : product.price * product.quantity,
          items: [
            {
              item_id: product.id,
              item_name: product.productName,
              price: product.price,
              quantity: product.quantity
            }
          ]
        });
      }
    });
  }

  public eventRemoveFromCart(product: ICartItem) {
    this.run((analytics) => {
      // Call gtag function by @types/gtag.js
      if (typeof window !== 'undefined') {
        window.gtag("event", "remove_from_cart", {
          currency: "THB",
          value: product.sale ? (product.price - (product.price * product.discount! / 100)) * product.quantity : product.price * product.quantity,
          items: [
            {
              item_id: product.id,
              item_name: product.productName,
              price: product.price,
              quantity: product.quantity
            }
          ]
        });
      }
    });
  }

  public eventBeginCheckout(cart: ICart, total: number) {
    this.run((analytics) => {

      let itemInCart: { item_id: number; item_name: string; price: number; quantity: number; }[] = [];
      cart.items.forEach(item => {
        //console.log(item)
        itemInCart.push(
          {
            'item_id': item.id,
            'item_name': item.productName,
            'price': item.sale ? item.price - (item.price * item.discount! / 100) : item.price,
            'quantity': item.quantity
          }
        );
      });

      //console.log(itemInCart)
      // Call gtag function by @types/gtag.js
      if (typeof window !== 'undefined') {
        window.gtag("event", "begin_checkout", {
          currency: "THB",
          value: total,
          items: itemInCart
        });
      }
    });
  }

  public conversionADS(orderNumber: string, total: number) {
    this.run((analytics) => {
      if (typeof window !== 'undefined') {
        window.gtag("event", "conversion", {
          send_to: "AW-585564604/bbbfCJmgxeIBELyDnJcC",
          value: 1.0,
          currency: 'THB',
          orderValue: total,
          transaction_id: orderNumber
        });
      }
    });
  }

  // // I identify the user to be associated with subsequent tracking events.
  // public identify(userID: UserIdentifier, traits: UserTraits): void {
  //   this.run((analytics) => {
  //     analytics.identify(userID, traits);
  //   });
  // }

  // // I track the given event for the previously-identified user.
  // public track(eventID: EventIdentifier, eventProperties: EventProperties): void {
  //   this.run((analytics) => {
  //     analytics.track(eventID, eventProperties);
  //   });
  // }

  // I return a Promise that resolves with the 3rd-party Analytics Script.
  private async getScript(): Promise<any> {
    // CAUTION: For the sake of simplicity, I am not going to worry about the case in
    // which the analytics scripts fails to load. Ideally, I might create some sort
    // of "Null Object" version of the analytics API such that the rest of the code
    // can run as expected with various no-op method implementations.
    if (this.scriptLoader) {
      await this.scriptLoader.load();
      //this.scriptLoader.addTagManager(environment.tagmanager);
      this.scriptLoader.addGtag(environment.ga, environment.ads);
    }
    // NOTE: Since I don't have an installed Type for this service, I'm just casting
    // Window to ANY and then re-casting the global service that we know was just
    // injected into the document HEAD.
    return ((window as any).analytics as any);
  }

  // I run the given callback after the remote analytics library has been loaded.
  private run(callback: (analytics: any) => void): void {
    this.getScript()
      .then(callback)
      .catch((error) => {
        console.log(error)
        // Swallow underlying analytics error - they are not important.
      });
  }
}
