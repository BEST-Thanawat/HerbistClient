import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IResetPassword } from '../../../shared/classes/user';
import { SeoService } from '../../../shared/services/seo.service';
import { ToastrTranslateService } from '../../../shared/services/toastr-translate.service';
import { AccountService } from '../../../shared/services/account.service';
import { ShopService } from '../../../shared/services/shop.service';
import { AppService } from '../../../shared/services/app.service';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule, TextInputComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  errors!: string[];
  paramsObject: any;

  constructor(private tts: ToastrTranslateService, private seoService: SeoService, private fb: FormBuilder, private accountService: AccountService, private router: Router,private acticateRoute: ActivatedRoute, private shopService: ShopService, private appService: AppService) { }

  ngOnInit(): void {
    this.seoService.setMainPageTags('Reset Password(เปลี่ยนรหัสผ่าน) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    if (this.appService.isBrowser()) {
      this.shopService.scrollToTop();
      this.createResetPasswordForm();

      this.acticateRoute.queryParamMap
        .subscribe((params) => {
          this.paramsObject = { ...params.keys, ...params };
          //console.log(this.paramsObject);
        }
      );
    }
  }

  createResetPasswordForm() {
    this.resetPasswordForm = this.fb.group({
      Password: [null, [Validators.required]],
      ConfirmPassword: [null, [Validators.required]],
      // Token: [null, [Validators.required]],
      // Email: [null, [Validators.required]]
    });
    this.resetPasswordForm.addValidators(
      this.matchValidator(this.resetPasswordForm.get('Password')!, this.resetPasswordForm.get('ConfirmPassword')!)
    );
  }

  matchValidator(control: AbstractControl, controlTwo: AbstractControl): ValidatorFn {
    return () => {
      if (control.value !== controlTwo.value)
        return { match_error: 'Value does not match' };
      return null;
    };
  }
  
  onSubmit() {
    const resetPassword: IResetPassword = { 
      Password: this.resetPasswordForm.get('Password')?.value,
      ConfirmPassword: this.resetPasswordForm.get('ConfirmPassword')?.value,
      Token: this.paramsObject.params.token!,
      Email: this.paramsObject.params.email!
    }

    this.accountService.resetPassword(resetPassword).subscribe({
      next: () => {
        this.router.navigateByUrl('/pages/reset/password/success');
      },
      error: (e) => { 
        this.errors = e.errors;
        console.error(e) 
      },
      complete: () => {
        this.tts.success('Your password has been successfully changed');
        // this.translate.get(['Your password has been successfully changed']).subscribe(translations => {
        //   this.toastr.success(translations['Your password has been successfully changed']);
        // });
      }
    });
  }
}
