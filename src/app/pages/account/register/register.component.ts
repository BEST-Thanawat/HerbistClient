import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { map, of, switchMap, timer } from 'rxjs';
import { AccountService } from '../../../shared/services/account.service';
import { SeoService } from '../../../shared/services/seo.service';
import { ToastrTranslateService } from '../../../shared/services/toastr-translate.service';
import { ShopService } from '../../../shared/services/shop.service';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
// import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-register',
  imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errors!: string[];
  
  loading = false;

  constructor(private tts: ToastrTranslateService, private seoService: SeoService, private fb: FormBuilder, private accountService: AccountService, private router: Router, private shopService: ShopService) { }

  ngOnInit(): void {
    this.seoService.setMainPageTags('Register(สร้างแอ็กเคานต์ใหม่) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.shopService.scrollToTop();
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
        [this.validateEmailNotTaken()]
      ],
      password: [null, [Validators.required]]
    });
  }

  onSubmit() {
    // this.ngxLoader.startLoader('loader-01');
    this.loading = true;
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/pages/dashboard');
      },
      error: (e) => {
        this.loading = false;      
        // this.ngxLoader.stopLoader('loader-01'); 
        this.errors = e.errors;
        console.error(e) 
      },
      complete: () => {        
        this.loading = false;      
        // this.ngxLoader.stopLoader('loader-01');
        this.tts.success('Your account has been successfully created');
        // this.translate.get(['Your account has been successfully created']).subscribe(translations => {
        //   this.toastr.success(translations['Your account has been successfully created']);
        // });
      }
    });
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe(
            map((res: any) => {
              return res ? {emailExists: true} : null;
            })
          );
        })
      );
    }
  }
}