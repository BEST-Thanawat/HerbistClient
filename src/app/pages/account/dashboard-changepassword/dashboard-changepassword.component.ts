import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IChangePassword } from '../../../shared/classes/user';
import { IUser } from '../../../shared/classes/user';
import { SeoService } from '../../../shared/services/seo.service';
import { ToastrTranslateService } from '../../../shared/services/toastr-translate.service';
import { AccountService } from '../../../shared/services/account.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShopService } from '../../../shared/services/shop.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-dashboard-changepassword',  
  imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule, TextInputComponent],
  templateUrl: './dashboard-changepassword.component.html',
  styleUrls: ['./dashboard-changepassword.component.scss']
})
export class DashboardChangepasswordComponent implements OnInit, OnDestroy {
  active = 'active';
  public openDashboard: boolean = false;
  currentUser$!: Observable<IUser | null>;
  changePasswordForm!: FormGroup;
  errors: string[] = [];

  loading = false;
  navigationSubs = new Subscription();

  modalLoadingRef?: BsModalRef;
  
  constructor(private modalService: BsModalService, private tts: ToastrTranslateService, private seoService: SeoService, private fb: FormBuilder, private accountService: AccountService, private shopService: ShopService) { 
    this.navigationSubs = this.shopService.getMobileDashboardSidebar().subscribe({
      next: (value: boolean) => {
        //console.log(value);
        this.openDashboard = value;
      }
    });
  }

  ngOnInit(): void {
    this.seoService.setMainPageTags('Dashboard(แดชบอร์ด) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.createChangePasswordForm();
    this.currentUser$ = this.accountService.currentUser$;
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

  createChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      current_password: [null, [Validators.required]],
      new_password: [null, [Validators.required]],
      new_password_again: [null, [Validators.required]]
    });
    this.changePasswordForm.addValidators(
      this.matchValidator(this.changePasswordForm!.get('new_password')!, this.changePasswordForm!.get('new_password_again')!)
    );
  }

  matchValidator(control: AbstractControl, controlTwo: AbstractControl): ValidatorFn {
    return () => {
      if (control.value !== controlTwo.value)
        return { match_error: 'Value does not match' };
      return null;
    };
  }

  // test() {
  //   this.errors = [];
  //   if (this.changePasswordForm.errors) {
  //     this.errors.push(this.changePasswordForm.errors.match_error);
  //   }
  // }
  onSubmit() {    
    //var spinnerRef = this.dialogService.start(this.tts.getTranslate('Processing Order...'));
    this.modalLoadingRef = this.modalService.show(LoadingComponent, {class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true});
    this.loading = true;
    
    let changePassword: IChangePassword = {
      CurrentPassword: this.changePasswordForm.get('current_password')?.value,
      NewPassword: this.changePasswordForm.get('new_password')?.value,
      ConfirmNewPassword: this.changePasswordForm.get('new_password_again')?.value,
      Email: this.accountService.getUserEmail(),
    }
    //console.log(changePassword);
    this.changePassword(changePassword);
  }
  
  changePassword(changePassword: IChangePassword) {
    this.accountService.changePassword(changePassword).subscribe({
      next: () => {
        this.changePasswordForm.reset();
        //this.router.navigateByUrl('/pages/dashboard');
      },
      error: (e) => {
        this.errors = e.errors;
        console.error(e);
        this.modalLoadingRef!.hide();
        this.loading = false;
      },
      complete: () => { 
        this.modalLoadingRef!.hide();
        this.loading = false;
        this.tts.success('Your password has been successfully changed');
        // this.translate.get(['Your password has been successfully changed']).subscribe(translations => {
        //   this.toastr.success(translations['Your password has been successfully changed']);
        // });
      }
    });
  }
}
