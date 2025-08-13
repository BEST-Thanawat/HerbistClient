import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IAddress } from '../../shared/classes/address';
import { IUser } from '../../shared/classes/user';
import { AccountService } from '../../shared/services/account.service';
import { ShopService } from '../../shared/services/shop.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { PhoneMaskDirective } from '../../shared/directive/phone-mask.directive';
import { CdkStepperModule } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout-billing-address',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, TextInputComponent, PhoneMaskDirective, CdkStepperModule],
  templateUrl: './checkout-billing-address.component.html',
  styleUrls: ['./checkout-billing-address.component.scss']
})

export class CheckoutBillingAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup | undefined;
  isUsedBillingAddress: boolean = false;
  currentUser$!: Observable<IUser | null>;
  isLoggedIn = false;

  constructor(private shopService: ShopService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.checkoutForm!.get('billingForm')?.get('b_province')?.patchValue('');
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe({
      next: (user: any) => {
        if (user) {
          this.isLoggedIn = true;
          this.getAddressFormValue();
        }
      },
      error: (e: any) => { console.log(e); }
    });
  }

  getAddressFormValue() {
    this.currentUser$.subscribe({
      next: (user: any) => {
        if (user) {
          this.accountService.getUserAddress().subscribe({
            next: (address: IAddress) => {
              if (address) {
                this.checkoutForm!.get('billingForm')?.patchValue({
                  b_company: address.billing_Company,
                  b_firstname: address.billing_FirstName,
                  b_lastname: address.billing_LastName,
                  b_address: address.billing_Street,
                  b_town: address.billing_City,
                  b_province: address.billing_Province,
                  b_postalcode: address.billing_ZipCode,
                  b_email: address.billing_Email == '' ? this.accountService.getUserEmail() : address.billing_Email,
                  b_phone: address.billing_Telephone,
                });
                this.checkoutForm!.get('billingForm')?.markAllAsTouched();

                if (address.billing_Company == '') {                  
                  this.checkoutForm!.get('billingForm.b_company')?.markAsUntouched();
                }
              }
            },
            error: (e) => console.log(e)
          });
        }
      },
      error: (e: any) => { console.log(e); }
    });
  }

  selectionBillingChanged(event: any) {
    let idx = event.target.value;
    //console.log('id:', idx);
    this.checkoutForm!.get('billingForm')?.get('b_province')?.clearValidators();

    if (idx == '') {
      this.checkoutForm!.get('billingForm')?.get('b_province')?.setValidators([
        Validators.required
      ]);

      this.checkoutForm!.get('billingForm')?.get('b_province')?.setValue('');
    }
    this.checkoutForm!.updateValueAndValidity();
  }

  forceValue(control: any) {
    this.checkoutForm!.get('billingForm')?.get('b_phone')?.patchValue(control.target.value);
  }

  forceValueZipcodeForm(control: any) {
    this.checkoutForm!.get('billingForm')?.get('b_postalcode')!.setValue(control.target.value);
  }

  eventUsedBilling(event: any) {
    this.isUsedBillingAddress = !this.isUsedBillingAddress;
  }  

  tapToTop() {
  	this.shopService.scrollToTop();
  }
}
