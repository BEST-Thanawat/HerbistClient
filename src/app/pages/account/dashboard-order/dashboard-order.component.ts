import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrder } from '../../../shared/classes/order';
import { OrderStatus } from '../../../shared/classes/order';
import { SeoService } from '../../../shared/services/seo.service';
import { IUser } from '../../../shared/classes/user';
import { AccountService } from '../../../shared/services/account.service';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { ShopService } from '../../../shared/services/shop.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-dashboard-order',
    imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule],
  templateUrl: './dashboard-order.component.html',
  styleUrls: ['./dashboard-order.component.scss']
})
export class DashboardOrderComponent implements OnInit, OnDestroy {
  active = 'active';
  public openDashboard: boolean = false;
  currentUser$!: Observable<IUser | null>;
  orders: IOrder[] | undefined;
  OrderStatus = OrderStatus;
  navigationSubs = new Subscription();
  
  constructor(private seoService: SeoService, private accountService: AccountService, private orderService: OrderService, public productService: ProductService, private shopService: ShopService) { 
    this.navigationSubs = this.shopService.getMobileDashboardSidebar().subscribe({
      next: (value: boolean) => {
        //console.log(value);
        this.openDashboard = value;
      }
    });
  }

  ngOnInit(): void {
    this.seoService.setMainPageTags('Dashboard(แดชบอร์ด) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.currentUser$ = this.accountService.currentUser$;
    this.getOrders();
  }

  ngOnDestroy(): void {
    this.navigationSubs.unsubscribe();
    this.shopService.setMobileDashboardSidebar(false);
  }

  getOrders() {
    this.orderService.getOrderForUser().subscribe({
      next: (orders: IOrder[] | any) => {
        if (orders) {
          this.orders = orders;
          //console.log(orders);
        }
      },
      error: (e) => {
        console.error(e)
      },
      //complete: () => { this.toastr.success('Your account has been successfully created'); }
    });
  }

  ToggleDashboard() {
    this.shopService.setMobileDashboardSidebar(!this.openDashboard);
  }

  logout() {
    this.accountService.logout();
  }
}
