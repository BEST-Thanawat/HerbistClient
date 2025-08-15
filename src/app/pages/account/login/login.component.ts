import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';
import { SeoService } from '../../../shared/services/seo.service';
import { ToastrTranslateService } from '../../../shared/services/toastr-translate.service';
import { ShopService } from '../../../shared/services/shop.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-login',
  imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl!: string;
  loading = false;

  constructor(
    private tts: ToastrTranslateService,
    private seoService: SeoService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.seoService.setMainPageTags('Login(ล็อกอิน) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.shopService.scrollToTop();
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/pages/dashboard';
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.loading = true;
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (e) => {
        this.loading = false;
        console.error(e);

        if (e.statusCode === 401) {
          this.tts.error(e.message);
        } else {
          this.tts.error(e.message + ' (' + e.statusCode + ')');
        }
      },
      complete: () => {
        this.loading = false;
        this.tts.success('Successfully logged in');
      },
    });
  }
}
