import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IBankAccount } from '../../shared/classes/bankAccount';
import { IOrder, IOrderItem } from '../../shared/classes/order';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { AppService } from '../../shared/services/app.service';
import { ProductService } from '../../shared/services/product.service';
import { ShopService } from '../../shared/services/shop.service';
import { environment } from '../../../environments/environment';
import { OrderStatus } from '../../shared/classes/order';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { from } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
  imports: [BreadcrumbComponent, CommonModule, TranslateModule, RouterModule, CdkStepperModule],
})
export class CheckoutSuccessComponent implements OnInit, AfterViewInit {
  order!: IOrder;
  bankAccounts!: IBankAccount[];
  description: string | undefined;
  currentDate: Date = new Date();
  orderStatus: string | undefined;
  OrderStatus = OrderStatus;

  sizes = '10vw';
  srcset = ''; //'160w, 200w, 320w, 481w, 672w, 800w, 1000w, 1200w';

  constructor(
    private analyticsService: AnalyticsService,
    private router: Router,
    public productService: ProductService,
    private shopService: ShopService,
    private appService: AppService,
    private orderService: OrderService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;

    try {
      if (state) {
        this.order = state as IOrder;

        // console.log(this.order);

        let imageUrl = environment.apiUrl.replace('api/', '');
        if (imageUrl.includes('https')) {
          imageUrl = imageUrl.replace('https', 'http');
        }
        let apiImageUrl = imageUrl + 'Content/images/products/';
        let cloudinaryUrl = environment.cloudinaryURL + '/' + environment.cloudinaryId + '/Products/';
        this.order.orderItems.forEach((product: IOrderItem, index: number, array: IOrderItem[]) => {
          let temp = array[index].itemOrdered.pictureUrl?.includes('https') ? array[index].itemOrdered.pictureUrl!.replace('https', 'http').replace(apiImageUrl, cloudinaryUrl) : array[index].itemOrdered.pictureUrl!.replace(apiImageUrl, cloudinaryUrl);
          array[index].pictureUrl = temp;
        });

        // console.log(this.order);

        if (this.order.paymentMethod.id === 1) {
          this.getBankAccount();
        }

        this.orderStatus = Object.values(OrderStatus)[Number(this.order.status)];
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    if (this.appService.isBrowser()) {
      this.shopService.scrollToTop();
      this.currentDate = this.addDays(this.order.orderDate, 7);

      this.analyticsService.eventPurchase(this.order, this.order.coupon === null ? '' : this.order.coupon.code, this.order.orderNumber, this.order.total, this.order.shippingPrice);
    }
  }

  ngAfterViewInit() {}

  getBankAccount() {
    this.shopService.getBankAccounts().subscribe({
      next: (accounts: IBankAccount[]) => {
        if (accounts) {
          this.bankAccounts = accounts;
          this.description = accounts[0].description;
        }
      },
      error: (e: any) => {
        console.log(e);
      },
    });
  }

  addDays(date: any, days: any) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  async exportInvoicePDF(order: IOrder) {
    const observablePDF = from(this.orderService.exportInvoicePDF(order)).subscribe();
  }

  async exportReceiptPDF(order: IOrder) {
    const observablePDF = from(this.orderService.exportReceiptPDF(order)).subscribe();
  }
}
