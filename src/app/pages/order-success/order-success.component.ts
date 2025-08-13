import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IBankAccount } from '../../shared/classes/bankAccount';
import { SeoService } from '../../shared/services/seo.service';
import { IOrder, IOrderItem } from '../../shared/classes/order';
import { OrderStatus } from '../../shared/classes/order';
import { OrderService } from '../../shared/services/order.service';
import { ProductService } from '../../shared/services/product.service';
import { ShopService } from '../../shared/services/shop.service';
import { from, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppService } from '../../shared/services/app.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {
  orderid: number | undefined;
  order!: IOrder;
  bankAccounts!: IBankAccount[];
  description: string | undefined;
  currentDate: Date | number | undefined;
  orderStatus: string | undefined;
  OrderStatus = OrderStatus;

  sizes = '10vw';
  srcset = '160w, 200w, 320w, 481w, 672w, 800w, 1000w, 1200w';

  constructor(private seoService: SeoService, private route: ActivatedRoute, public productService: ProductService, private orderService: OrderService, private shopService: ShopService, private appService: AppService) { 
    if (this.appService.isBrowser()) {
      this.orderid = Number(this.route.snapshot.paramMap.get('id'));
      this.getOrderDetails(this.orderid);
    }
  }

  ngOnInit(): void { 
    this.seoService.setNormalPageTags('Order Details(รายละเอียดออร์เดอร์) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');
    this.shopService.scrollToTop();
  }

  getOrderDetails(id: number) {
    this.orderService.getOrderForUserById(id).pipe(map((order: IOrder | any) => {
      if (environment.cloudinary === true) {
        let imageUrl = environment.apiUrl.replace('api/', '')
        if (imageUrl.includes('https')) { 
          imageUrl = imageUrl.replace('https', 'http');
        }
        let apiImageUrl = imageUrl + 'Content/images/products/';
        let cloudinaryUrl = environment.cloudinaryId + '/Products/';

        order.orderItems.forEach((product: IOrderItem, index: number, array: IOrderItem[]) => {
          let temp = array[index].pictureUrl?.includes('https') ? array[index].pictureUrl!.replace('https', 'http').replace(apiImageUrl, cloudinaryUrl) : array[index].pictureUrl!.replace(apiImageUrl, cloudinaryUrl);
          array[index].pictureUrl = temp; 
        });
      }

      return order;
    })).subscribe({
      next: (order: IOrder | any) => {
        //console.log(order);
        this.order = order;
        this.currentDate = this.addDays(this.order.orderDate, 7);
        this.getBankAccount();

        this.orderStatus = Object.values(OrderStatus)[Number(this.order.status)];
        //console.log(this.order);
      }
    });
  }

  getBankAccount() {
    this.shopService.getBankAccounts().subscribe({
      next: (accounts: IBankAccount[]) => {
        if (accounts) {
          this.bankAccounts = accounts;
          this.description = accounts[0].description;
        }
      },
      error: (e: any) => { console.log(e); }
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
