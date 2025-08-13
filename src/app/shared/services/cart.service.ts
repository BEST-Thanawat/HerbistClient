import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map } from 'rxjs';
import { ToastrTranslateService } from './toastr-translate.service';
import { OrderService } from './order.service';
import { LocalstorageService } from './localstorage.service';
import { ICoupon } from '../classes/coupon';
import { AppService } from './app.service';
import { AnalyticsService } from './analytics.service'; 
import { Cart, ICart, ICartItem, ICartTotals } from '../classes/cart';
import { IDeliveryMethod } from '../classes/deliveryMethod';
import { IProduct } from '../classes/product';
import { ShopService } from './shop.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private cartSource: BehaviorSubject<ICart | null> = new BehaviorSubject<ICart | null>(null);
  cart$ = this.cartSource.asObservable();
  private cartTotalSource: BehaviorSubject<ICartTotals | null> = new BehaviorSubject<ICartTotals | null>(null);
  cartTotals$ = this.cartTotalSource.asObservable();
  private shippingPriceSource: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  shippingPrice$ = this.shippingPriceSource.asObservable();
  private couponDiscountSource: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  couponDiscount$ = this.couponDiscountSource.asObservable();
  couponDiscount: number = 0;
  deliveryMethods: IDeliveryMethod[] | undefined = [];

  constructor(private analyticsService: AnalyticsService, private tts: ToastrTranslateService, private http: HttpClient, private orderService: OrderService, private shopService: ShopService, private localStorageService: LocalstorageService, private appService: AppService) { }

  getCart(id: string) {
    return this.http.get(this.baseUrl + 'cart?id=' + id).pipe(
      map((cart: ICart | any) => {
        // console.log(cart);
        if (cart.items.length == 0 || cart.items == null) {
          this.deleteCart(cart);
        }

        this.cartSource.next(cart);
        this.calculateTotals(cart, null);
      })
    );
  }

  setCart(cart: ICart) {
    //console.log(cart);
    return this.http.post(this.baseUrl + 'cart', cart).subscribe({
      next: (response: any) => {
        this.cartSource.next(response);
        this.calculateTotals(cart, null);
      },
      error: (e) => { console.error(e) },
      //complete: () => { console.info('complete') }
    });
  }

  incrementItemQuantity(item: ICartItem) {
    const cart = this.cartSource.value;
    const foundItemIndex = cart?.items.findIndex(x => x.id === Number(item.id));
    const stock = this.calculateStockCounts(cart?.items[foundItemIndex!], 1);

    if (cart?.items[foundItemIndex!].quantity !== 0 && stock) {
      cart!.items[foundItemIndex!].quantity! += 1;
      this.tts.info('Product added');
    }
    this.setCart(cart!);
  }

  decrementItemQuantity(item: ICartItem) {
    const cart = this.cartSource.value;
    const foundItemIndex = cart?.items.findIndex(x => x.id === Number(item.id));
    if (foundItemIndex !== undefined) {
      if (cart?.items[foundItemIndex].quantity! > 1) {
        if (cart?.items[foundItemIndex!].quantity) {
          cart.items[foundItemIndex!].quantity! -= 1;
          this.tts.info('Product reduced');
          this.setCart(cart!);
        }
      } else {
        this.removeItemFromCart(item);
      }
    }
  }

  removeItemFromCart(item: ICartItem) {
    const cart = this.cartSource.value;
    if (cart?.items.some(x => x.id === Number(item.id))) {
      cart.items = cart.items.filter(i => i.id !== item.id);
      if (cart.items.length > 0) {
        this.setCart(cart);
        this.tts.info('Product removed');
      } else {
        this.deleteCart(cart);
        this.tts.info('Product removed');
      }

      this.analyticsService.eventRemoveFromCart(item);
    }
  }

  deleteCart(cart: ICart) {
    //console.log('delete bs');
    return this.http.delete(this.baseUrl + 'cart?id=' + cart.id).subscribe({
      //next: (response) => { this.types = response; },
      next: () => {
        this.cartSource.next(null);
        this.cartTotalSource.next(null);
        this.couponDiscountSource.next(null);
        localStorage.removeItem('cart_id');
      },
      error: (e) => { console.error(e) },
      //complete: () => { console.info('complete') }
    });
  }

  deleteCartById(id: string) {
    //console.log('delete bs');
    return this.http.delete(this.baseUrl + 'cart?id=' + id).subscribe({
      //next: (response) => { this.types = response; },
      next: () => {
        this.cartSource.next(null);
        this.cartTotalSource.next(null);
        this.couponDiscountSource.next(null);
        localStorage.removeItem('cart_id');
      },
      error: (e) => { console.error(e) },
      //complete: () => { console.info('complete') }
    });
  }

  addItemToCart(item: IProduct, quantity = 1) {
    const itemToAdd: ICartItem = this.mapProductItemToCartItem(item, quantity);
    let cart = this.cartSource.value;
    if (cart === null) {
      cart = this.createCart();
    }

    const foundItemIndex = cart?.items.findIndex(x => x.id === Number(item.id));
    if (foundItemIndex !== -1) {
      const stock = this.calculateStockCounts(cart?.items[foundItemIndex!], 1);
      if (!stock) return;
    }

    cart.items = this.addOrUpdateItem(cart.items, itemToAdd, quantity);
    //console.log(cart.items);
    this.setCart(cart);

    this.analyticsService.eventAddToCart(itemToAdd);
  }

  createCart(): ICart {
    const cart = new Cart();
    if (this.appService.isBrowser()) {
      this.localStorageService.setItem('cart_id', cart.id!);
      return cart;
    }
    return cart;
  }

  private calculateTotals(basket: ICart, coupon: ICoupon | null) {
    // Coupon
    let couponDiscount = 0;
    if (coupon) {
      // Check limit used
      if ((coupon.limit - coupon.timeUsed) > 0)
      {
        if (coupon.forProducts === null || coupon.forProducts === undefined) {
          // Filter only for non sale product
          const nonDiscountItems = basket?.items.filter(item => item.sale === false);
          // Apply discount by %
          couponDiscount = nonDiscountItems.reduce((a, b) => (((b.price * coupon.discount / 100)) * b.quantity) + a, 0);
          this.couponDiscount = couponDiscount;
          this.couponDiscountSource.next(couponDiscount);
        }
      }      
    }

    //const basket = this.getCurrentCartValue();
    //const shipping = this.shipping;
    const subtotal = basket?.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    //const subtotal = basket?.items.reduce((a, b) => b.sale ? ((b.price - (b.price * b.discount / 100)) * b.quantity) + a : (b.price * b.quantity) + a, 0); 
    const discount = basket?.items.reduce((a, b) => b.sale ? ((b.price * b.discount! / 100) * b.quantity) + a : 0 + a, 0);
    const totalDiscount = discount;
    const total = subtotal - discount;// + shipping;   
    this.cartTotalSource.next({ total: total, subtotal: subtotal, discount: totalDiscount }); //shipping: shipping,

    // Check if after applied coupon but the total less than 1000. This will not get free shipping
    const cart = this.getCurrentCartValue();
    if ((total + cart?.shippingPrice! - couponDiscount) < 1000)
    {
      this.orderService.getDeliveryMethods(cart!).pipe(delay(100)).subscribe({
        next: (dm: any) => {
          //if select Free EMS then force to EMS
          if (cart?.deliveryMethodId === 3) {
            const currentDeliveryMethod = dm.filter((element : any) => { return element.id == 1; })[0];
            this.setShippingPriceAndMethodId(currentDeliveryMethod.total, 1);
          }
          //if select Free Kerry then force to Kerry
          else if (cart?.deliveryMethodId === 4) {
            const currentDeliveryMethod = dm.filter((element : any) => { return element.id == 2; })[0];
            this.setShippingPriceAndMethodId(currentDeliveryMethod.total, 2);
          }
          this.deliveryMethods = dm;
        },
        error: (e: any) => { console.log(e); },
        // complete: () => { }
      });
    }
  }

  private calculateStockCounts(product: any, quantity: any) {
    const qty = product.quantity + quantity;
    const stock = product.stock;

    if (stock < qty || stock == 0) {
      //this.tts.error('You can not add more items than available. In stock')
      this.tts.error(this.tts.getTranslate('You can not add more items than available. In stock') + ' ' + stock + ' ' + this.tts.getTranslate('Items'));
      return false
    }
    return true
  }

  private addOrUpdateItem(items: ICartItem[], itemToAdd: ICartItem, quantity: number): ICartItem[] {
    const index = items.findIndex(i => i.id === Number(itemToAdd.id));
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    this.tts.info('Product added');
    return items;
  }

  private mapProductItemToCartItem(item: IProduct, quantity: number): ICartItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.images[0].src,//item.pictureUrl,
      quantity,
      stock: item.stock,
      brand: item.productBrand,
      type: item.productType,

      sale: item.sale,
      discount: item.discount
    };
  }

  public getCurrentCartValue() {
    return this.cartSource.value;
  }

  // Stripe
  createPaymentIntent(id: string) {
    return this.http.post(this.baseUrl + 'orders/' + id, {}).pipe(
      map((basket: ICart | any) => {
        //console.log(basket);
        this.cartSource.next(basket);
      })
    );
  }

  // Shipping
  getDeliveryMethodsName() {
    this.shopService.getDeliveryMethods().subscribe({
      next: (methods: IDeliveryMethod[]) => {
        this.deliveryMethods = methods;
      }
    });
  }

  setShippingPriceAndMethodId(shippingPrice: number, methodId: number) {
    //console.log(1); 
    this.shippingPriceSource.next(shippingPrice);
    const cart = this.cartSource.value;
    cart!.deliveryMethodId = methodId;
    cart!.shippingPrice = shippingPrice;
    this.setCart(cart!);
  }
  clearShippingPrice() {
    this.shippingPriceSource.next(0);
  }
  setZipcode(zipcode: string) {
    this.cartSource.value!.zipcode = zipcode;
    this.cartSource.next(this.cartSource.value);
    this.clearShippingPrice();
  }
  clearZipcode() {
    if (this.cartSource.value) this.cartSource.value.zipcode = "";
    this.cartSource.next(this.cartSource.value);
  }

  // Coupon
  setCouponDiscount(coupon: ICoupon) {
    const cart = this.getCurrentCartValue();
    this.calculateTotals(cart!, coupon);
  }
  clearCouponDiscount() {
    this.couponDiscountSource.next(0);
  }
}
