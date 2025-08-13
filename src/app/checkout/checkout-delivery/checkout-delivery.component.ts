import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { delay, Observable } from 'rxjs';
import { ICart, ICartTotals } from '../../shared/classes/cart';
import { IDeliveryMethod } from '../../shared/classes/deliveryMethod';
import { CartService } from '../../shared/services/cart.service';
import { OrderService } from '../../shared/services/order.service';
import { ProductService } from '../../shared/services/product.service';
import { ShopService } from '../../shared/services/shop.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout-delivery',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm: FormGroup | undefined;
  cart$: Observable<ICart | null> = new Observable<ICart | null>();
  cartTotals$!: Observable<ICartTotals | null>;
  shippingPrice$!: Observable<number | null>;
  
  deliveryMethods!: IDeliveryMethod[];

  total: number | undefined;
  deliveryMethodId: number | undefined;

  constructor(private shopService: ShopService, private orderService: OrderService, private cartService: CartService, public productService: ProductService, ) { }

  ngOnInit(): void {
    this.getCartAndTotal();
  }

  private getCartAndTotal() {
    this.cart$ = this.cartService.cart$;
    this.cartTotals$ = this.cartService.cartTotals$;
    this.shippingPrice$ = this.cartService.shippingPrice$;

    this.cart$.subscribe({
      next: (cart: ICart | any)=> {
        if (cart) {
          //console.log('getCartAndTotal');
          this.orderService.getDeliveryMethods(cart).pipe(delay(100)).subscribe({
            next: (dm: any) => {
              this.deliveryMethods = dm;
            },
            error: (e: any) => { console.log(e); },
            // complete: () => { }
          });
        }
      },
      error: (e: any) => { console.log(e); }
    });
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.total = deliveryMethod.total;
    this.deliveryMethodId = deliveryMethod.id;
  }

  setShippingPriceAndMethodId() {
  	this.shopService.scrollToTop();
    // console.log(this.total);
    // console.log(this.deliveryMethodId);
    this.cartService.setShippingPriceAndMethodId(this.total!, this.deliveryMethodId!);
  }
  clearShippingMethod() {    
    this.checkoutForm!.get('deliveryForm')?.get('shippingmethodid')?.patchValue('');
    this.cartService.clearShippingPrice();
  }
}
