import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../../../shared/classes/user';
import { AccountService } from '../../../shared/services/account.service';
import { IAddress } from '../../../shared/classes/address';
import { ShopService } from '../../../shared/services/shop.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrTranslateService } from '../../../shared/services/toastr-translate.service';
import { SeoService } from '../../../shared/services/seo.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { PhoneMaskDirective } from '../../../shared/directive/phone-mask.directive';

@Component({
  selector: 'app-dashboard-addressbook',
  imports: [BreadcrumbComponent, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule, TextInputComponent, PhoneMaskDirective],
  templateUrl: './dashboard-addressbook.component.html',
  styleUrls: ['./dashboard-addressbook.component.scss'],
})
export class DashboardAddressbookComponent implements OnInit, OnDestroy {
  active = 'active';
  public openDashboard: boolean = false;
  currentUser$!: Observable<IUser | null>;
  addressBook!: FormGroup;
  // billingAddressForm!: FormGroup;
  errors!: string[];
  errorsBillingAddress!: string[];
  isUsedBillingAddress: boolean = false;
  disabledBillingAddress: boolean = true;
  tempAddress: IAddress | undefined;
  navigationSubs = new Subscription();

  modalLoadingRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private tts: ToastrTranslateService,
    private seoService: SeoService,
    private fb: FormBuilder,
    private accountService: AccountService,
    private shopService: ShopService
  ) {
    this.navigationSubs = this.shopService.getMobileDashboardSidebar().subscribe({
      next: (value: boolean) => {
        //console.log(value);
        this.openDashboard = value;
      },
    });
  }

  ngOnInit(): void {
    this.seoService.setMainPageTags('Dashboard(แดชบอร์ด) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า');

    this.createDefaultAddressForm();
    //this.createBillingtAddressForm();
    this.addressBook!.get('defaultAddressForm')!.patchValue({ province: '' });
    this.addressBook!.get('billingAddressForm')!.patchValue({ b_province: '' });

    this.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.navigationSubs.unsubscribe();
    this.shopService.setMobileDashboardSidebar(false);
  }

  getCurrentUser() {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe({
      next: (user: any) => {
        if (user) {
          this.getAddressFormValue(user.email);
          this.createTempAddressForm(user.email);
        }
      },
      error: (e: any) => {
        console.log(e);
      },
    });
  }

  ToggleDashboard() {
    this.shopService.setMobileDashboardSidebar(!this.openDashboard);
  }

  logout() {
    this.accountService.logout();
  }

  createDefaultAddressForm() {
    this.addressBook = this.fb.group({
      defaultAddressForm: this.fb.group({
        company_name: [null],
        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        street: [null, [Validators.required]],
        city: [null, [Validators.required]],
        province: [null, [Validators.required]],
        zipcode: [null, [Validators.required, Validators.pattern('[0-9]{5}')]],
        email: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
        tel: [null, [Validators.required, Validators.pattern('^[0]\\d{2}-\\d{3}-\\d{4}$')]],
      }),
      billingAddressForm: this.fb.group({
        b_company_name: [null],
        b_firstname: [null, [Validators.required]],
        b_lastname: [null, [Validators.required]],
        b_street: [null, [Validators.required]],
        b_city: [null, [Validators.required]],
        b_province: [null, [Validators.required]],
        b_zipcode: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
        b_email: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
        b_tel: [null, [Validators.required, Validators.pattern('^[0]\\d{2}-\\d{3}-\\d{4}$')]],
      }),
    });

    // this.addressBook = new FormGroup({
    //   defaultAddressForm: new FormGroup({
    //     company_name: new FormControl(null),
    //     firstname: new FormControl(null, [Validators.required]),
    //     lastname: new FormControl(null, [Validators.required]),
    //     street: new FormControl(null, [Validators.required]),
    //     city: new FormControl(null, [Validators.required]),
    //     province: new FormControl(null, [Validators.required]),
    //     zipcode: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{5}')]),
    //     email: new FormControl(null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
    //     tel: new FormControl(null, [Validators.required, Validators.pattern('^[0]\\d{2}-\\d{3}-\\d{4}$')]),
    //   }),
    //   billingAddressForm: new FormGroup({
    //     b_company_name: new FormControl(null),
    //     b_firstname: new FormControl(null, [Validators.required]),
    //     b_lastname: new FormControl(null, [Validators.required]),
    //     b_street: new FormControl(null, [Validators.required]),
    //     b_city: new FormControl(null, [Validators.required]),
    //     b_province: new FormControl(null, [Validators.required]),
    //     b_zipcode: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    //     b_email: new FormControl(null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
    //     b_tel: new FormControl(null, [Validators.required, Validators.pattern('^[0]\\d{2}-\\d{3}-\\d{4}$')]),
    //   }),
    // });
  }

  createTempAddressForm(email: string) {
    this.tempAddress = {
      company: '',
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      province: '',
      zipCode: '',
      telephone: '',
      email: email,
      additionalMessage: '',
      isBillingAddress: false,
      billing_Company: '',
      billing_FirstName: '',
      billing_LastName: '',
      billing_Street: '',
      billing_City: '',
      billing_Province: '',
      billing_ZipCode: '',
      billing_Telephone: '',
      billing_Email: email,
    };
  }

  onSubmit() {
    //var spinnerRef = this.dialogService.start(this.tts.getTranslate('Processing Order...'));
    this.modalLoadingRef = this.modalService.show(LoadingComponent, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });

    const addressBook: IAddress = {
      company: this.addressBook!.get('defaultAddressForm.company_name')?.value === null ? '' : this.addressBook!.get('defaultAddressForm.company_name')?.value,
      firstName: this.addressBook!.get('defaultAddressForm.firstname')?.value,
      lastName: this.addressBook!.get('defaultAddressForm.lastname')?.value,
      street: this.addressBook!.get('defaultAddressForm.street')?.value,
      city: this.addressBook!.get('defaultAddressForm.city')?.value,
      province: this.addressBook!.get('defaultAddressForm.province')?.value,
      zipCode: this.addressBook!.get('defaultAddressForm.zipcode')?.value.toString(),
      telephone: this.addressBook!.get('defaultAddressForm.tel')?.value,
      email: this.addressBook!.get('defaultAddressForm.email')?.value,
      additionalMessage: '',
      isBillingAddress: this.tempAddress!.isBillingAddress,
      billing_Company: this.tempAddress!.billing_Company,
      billing_FirstName: this.tempAddress!.billing_FirstName,
      billing_LastName: this.tempAddress!.billing_LastName,
      billing_Street: this.tempAddress!.billing_Street,
      billing_City: this.tempAddress!.billing_City,
      billing_Province: this.tempAddress!.billing_Province,
      billing_ZipCode: this.tempAddress!.billing_ZipCode,
      billing_Telephone: this.tempAddress!.billing_Telephone,
      billing_Email: this.tempAddress!.billing_Email,
    };

    this.accountService.updateUserAddress(addressBook).subscribe({
      next: () => {
        //this.router.navigateByUrl('/pages/dashboard/addressbook');
        this.tempAddress = addressBook;
        this.disabledBillingAddress = false;
      },
      error: (e) => {
        this.errors = e.errors;
        console.error(e);
        this.modalLoadingRef!.hide();
      },
      complete: () => {
        this.tts.success('Save Default Address Successfully');
        this.modalLoadingRef!.hide();
        // this.translate.get(['Save Default Address Successfully']).subscribe(translations => {
        //   this.toastr.success(translations['Save Default Address Successfully']);
        // });
      },
    });
  }

  onSubmitBillingAddress() {
    //var spinnerRef = this.dialogService.start(this.tts.getTranslate('Processing Order...'));
    this.modalLoadingRef = this.modalService.show(LoadingComponent, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });

    const addressBook: IAddress = {
      company: this.tempAddress!.company,
      firstName: this.tempAddress!.firstName,
      lastName: this.tempAddress!.lastName,
      street: this.tempAddress!.street,
      city: this.tempAddress!.city,
      province: this.tempAddress!.province,
      zipCode: this.tempAddress!.zipCode,
      telephone: this.tempAddress!.telephone,
      email: this.tempAddress!.email,
      additionalMessage: '',
      isBillingAddress: this.isUsedBillingAddress,
      billing_Company: this.isUsedBillingAddress ? (this.addressBook!.get('billingAddressForm.b_company_name')?.value === null ? '' : this.addressBook!.get('billingAddressForm.b_company_name')?.value) : '',
      billing_FirstName: this.isUsedBillingAddress ? this.addressBook!.get('billingAddressForm.b_firstname')?.value : '',
      billing_LastName: this.isUsedBillingAddress ? this.addressBook!.get('billingAddressForm.b_lastname')?.value : '',
      billing_Street: this.isUsedBillingAddress ? this.addressBook!.get('billingAddressForm.b_street')?.value : '',
      billing_City: this.isUsedBillingAddress ? this.addressBook!.get('billingAddressForm.b_city')?.value : '',
      billing_Province: this.isUsedBillingAddress ? this.addressBook!.get('billingAddressForm.b_province')?.value : '',
      billing_ZipCode: this.isUsedBillingAddress ? this.addressBook!.get('billingAddressForm.b_zipcode')?.value.toString() : '',
      billing_Telephone: this.isUsedBillingAddress ? this.addressBook!.get('billingAddressForm.b_tel')?.value : '',
      billing_Email: this.isUsedBillingAddress ? this.addressBook!.get('billingAddressForm.b_email')?.value : '',
    };

    this.accountService.updateUserAddress(addressBook).subscribe({
      next: () => {
        //this.router.navigateByUrl('/pages/dashboard/addressbook');
      },
      error: (e) => {
        this.errorsBillingAddress = e.errors;
        console.error(e);
        this.modalLoadingRef!.hide();
      },
      complete: () => {
        this.tts.success('Save Billing Address Successfully');
        this.modalLoadingRef!.hide();
        // this.translate.get(['Save Billing Address Successfully']).subscribe(translations => {
        //   this.toastr.success(translations['Save Billing Address Successfully']);
        // });
      },
    });
  }

  selectionChanged(event: any) {
    let idx = event.target.value;
    //console.log('id:', idx);
    this.addressBook!.get('defaultAddressForm.province')!.clearValidators();

    if (idx == '') {
      this.addressBook!.get('defaultAddressForm.province')!.setValidators([Validators.required]);

      this.addressBook!.get('defaultAddressForm.province')!.setValue('');
    }
    this.addressBook!.updateValueAndValidity();
  }

  selectionBillingChanged(event: any) {
    let idx = event.target.value;
    //console.log('id:', idx);
    this.addressBook!.get('billingAddressForm.b_province')!.clearValidators();

    if (idx == '') {
      this.addressBook!.get('billingAddressForm.b_province')!.setValidators([Validators.required]);

      this.addressBook!.get('billingAddressForm.b_province')!.setValue('');
    }
    this.addressBook!.updateValueAndValidity();
  }

  eventUsedBilling() {
    this.isUsedBillingAddress = !this.isUsedBillingAddress;

    if (!this.isUsedBillingAddress) {
      this.onSubmitBillingAddress();
    }
  }

  check() {
    console.log(this.addressBook!.get('billingAddressForm'));
    console.log(this.addressBook!.get('billingAddressForm')!.valid);
  }

  getAddressFormValue(email: string) {
    this.accountService.getUserAddress().subscribe({
      next: (address) => {
        if (address) {
          this.disabledBillingAddress = false;
          this.tempAddress = address;
          this.isUsedBillingAddress = address.isBillingAddress;

          //this.addressBook!.get('defaultAddressForm')?.patchValue(address);
          this.addressBook!.get('defaultAddressForm')!.patchValue({
            company_name: address.company,
            firstname: address.firstName,
            lastname: address.lastName,
            street: address.street,
            city: address.city,
            province: address.province,
            zipcode: address.zipCode,
            email: address.email === '' ? email : address.email,
            tel: address.telephone,
          });

          this.addressBook!.get('billingAddressForm')!.patchValue({
            b_company_name: address.billing_Company,
            b_firstname: address.billing_FirstName,
            b_lastname: address.billing_LastName,
            b_street: address.billing_Street,
            b_city: address.billing_City,
            b_province: address.billing_Province,
            b_zipcode: address.billing_ZipCode,
            b_email: address.billing_Email === '' ? email : address.billing_Email,
            b_tel: address.billing_Telephone,
          });

          this.addressBook!.get('billingAddressForm')!.get('b_firstname')?.patchValue(address.billing_FirstName);

          if (this.addressBook!.get('defaultAddressForm')!.valid) {
            this.addressBook!.get('defaultAddressForm')!.markAllAsTouched();
          }

          if (this.addressBook!.get('billingAddressForm')!.valid) {
            this.addressBook!.get('billingAddressForm')!.markAllAsTouched();
          }

          // if (address.company !== '') {
          //   this.addressBook!.get('defaultAddressForm.company_name').markAsTouched();
          // }

          // if (address.billing_Company !== '') {
          //   this.addressBook!.get('billingAddressForm.b_company_name').markAsTouched();
          // }
        } else {
          this.isUsedBillingAddress = false;
          this.addressBook!.get('defaultAddressForm.email')!.setValue(email);
          this.addressBook!.get('defaultAddressForm.email')!.value === '' ? this.addressBook!.get('defaultAddressForm.email')!.markAsUntouched : this.addressBook!.get('defaultAddressForm.email')!.markAsTouched();
          this.addressBook!.get('billingAddressForm.b_email')!.setValue(email);
          this.addressBook!.get('billingAddressForm.b_email')!.value === '' ? this.addressBook!.get('billingAddressForm.b_email')!.markAsUntouched : this.addressBook!.get('billingAddressForm.b_email')!.markAsTouched();
        }
      },
      error: (e) => console.log(e),
    });
  }

  forceValueDefaultAddressForm(control: any) {
    this.addressBook!.get('defaultAddressForm.tel')!.setValue(control.target.value);
  }
  forceValueBillingAddressForm(control: any) {
    this.addressBook!.get('billingAddressForm.b_tel')!.setValue(control.target.value);
  }

  // getAddressFormValue2() {
  //   this.accountService.getUserAddress().subscribe({
  //     next: (address) => {
  //       if (address) {
  //         this.addressBook!.get('billingAddressForm').patchValue({
  //           b_company_name: address.billing_company,
  //           b_firstname: address.billing_firstName,
  //           b_lastname: address.billing_lastName,
  //           b_street: address.billing_street,
  //           b_city: address.billing_city,
  //           b_province: address.billing_province,
  //           b_zipcode: address.billing_zipCode,
  //           //email: address.email,
  //           b_tel: address.billing_telephone
  //         });
  //       }
  //     },
  //     error: (e) => console.log(e)
  //   });
  // }
}
