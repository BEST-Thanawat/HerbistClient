import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../shared/services/seo.service';
import { ShopService } from '../../../shared/services/shop.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-forget-password-sent',
    imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule],
  templateUrl: './forget-password-sent.component.html',
  styleUrls: ['./forget-password-sent.component.scss']
})
export class ForgetPasswordSentComponent implements OnInit {
  
  constructor(private seoService: SeoService, private shopService: ShopService) { }

  ngOnInit(): void { 
    this.seoService.setMainPageTags('Forget Password(ลืมรหัสผ่าน) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.shopService.scrollToTop(); }
}
