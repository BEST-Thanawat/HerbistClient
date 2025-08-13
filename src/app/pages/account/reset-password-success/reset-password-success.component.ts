import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';
import { ShopService } from '../../../shared/services/shop.service';
import { BreadcrumbComponent } from "../../../shared/components/breadcrumb/breadcrumb.component";
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password-success',
  templateUrl: './reset-password-success.component.html',
  styleUrls: ['./reset-password-success.component.scss'],
  imports: [BreadcrumbComponent, TranslateModule, RouterModule]
})
export class ResetPasswordSuccessComponent implements OnInit {
  
  constructor(private seoService: SeoService, private shopService: ShopService) { }

  ngOnInit(): void {    
    this.seoService.setMainPageTags('Reset Password(เปลี่ยนรหัสผ่าน) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.shopService.scrollToTop(); }
}
