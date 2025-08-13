import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../../../shared/classes/user';
import { SeoService } from '../../../shared/services/seo.service';
import { AccountService } from '../../../shared/services/account.service';
import { ShopService } from '../../../shared/services/shop.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  active = 'active';
  public openDashboard: boolean = false;
  currentUser$!: Observable<IUser | null>;
  
  navigationSubs = new Subscription();
  
  constructor(private seoService: SeoService, private accountService: AccountService, private shopService: ShopService) { 
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
    //console.log(this.currentUser$);
    this.shopService.scrollToTop();
  }

  ngOnDestroy(): void {
    this.navigationSubs.unsubscribe();
    this.shopService.setMobileDashboardSidebar(false);
  }

  ToggleDashboard() {
    this.shopService.setMobileDashboardSidebar(!this.openDashboard);
  }

  logout() {
    this.accountService.logout();
  }
}
