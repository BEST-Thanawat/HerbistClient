import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../shared/services/seo.service';
import { ShopService } from '../../shared/services/shop.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-payment-success',
  imports: [RouterModule, TranslateModule],
  templateUrl: './confirm-payment-success.component.html',
  styleUrls: ['./confirm-payment-success.component.scss']
})
export class ConfirmPaymentSuccessComponent implements OnInit {

  constructor(private seoService: SeoService, private shopService: ShopService) { }

  ngOnInit(): void {
    this.seoService.setNormalPageTags('Confirm Payment(แจ้งชำระเงิน) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');    
    this.shopService.scrollToTop(); }
}
