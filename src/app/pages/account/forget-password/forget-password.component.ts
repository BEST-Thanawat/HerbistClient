import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IForgotPassword } from '../../../shared/classes/user';
import { SeoService } from '../../../shared/services/seo.service';
import { ToastrTranslateService } from '../../../shared/services/toastr-translate.service';
import { AccountService } from '../../../shared/services/account.service';
import { ShopService } from '../../../shared/services/shop.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-forget-password',
    imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule, TextInputComponent],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  errors!: string[];
  
  constructor(private tts: ToastrTranslateService, private seoService: SeoService, private fb: FormBuilder, private accountService: AccountService, private router: Router, private shopService: ShopService) { }

  ngOnInit(): void {
    this.seoService.setMainPageTags('Forget Password(ลืมรหัสผ่าน) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.shopService.scrollToTop();
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]]
    });
  }

  onSubmit() {
    const forgotpPassword: IForgotPassword = { Email: this.forgotPasswordForm.get('email')?.value }
    this.accountService.forgotPassword(forgotpPassword).subscribe({
      next: () => {
        this.router.navigateByUrl('/pages/forget/password/sent');
      },
      error: (e) => { 
        this.errors = e.errors;
        console.error(e) 
      },
      complete: () => {
        this.tts.success('Please check your email for further instructions');
        // this.translate.get(['Please check your email for further instructions']).subscribe(translations => {
        //   this.toastr.success(translations['Please check your email for further instructions']);
        // });
      }
    });
  }
}