import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { IAddress } from '../../shared/classes/address';
import { IUser } from '../../shared/classes/user';
import { AccountService } from '../../shared/services/account.service';
import { CartService } from '../../shared/services/cart.service';
import { ShopService } from '../../shared/services/shop.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-checkout-address',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, TextInputComponent],
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup | undefined;
  spinnerStatus: boolean = false;
  isUsedBillingAddress: boolean = false;
  isLoggedIn = false;
  isEmptyEmail = true;
  email: string | undefined;
  currentUser$!: Observable<IUser | null>;
  columnWidth$!: Observable<string | null>;
  addressNull: boolean = true;

  checkZipcode: string = '';
  @ViewChild('fieldName') fieldName: ElementRef | undefined;
  constructor(private shopService: ShopService, private cartService: CartService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.checkoutForm!.get('addressForm')?.get('country')?.markAsTouched();
    this.checkoutForm!.get('addressForm')?.get('province')?.patchValue('');
    
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe({
      next: (user: any) => {
        if (user) {
          this.isLoggedIn = true;
          this.getAddressFormValue(user.email);

          this.columnWidth$ = this.currentUser$.pipe(
            switchMap(() => ['is-valid'])
          );
        }
      },
      error: (e: any) => { console.log(e); }
    });

    // this.columnWidth$ = this.currentUser$.pipe(
    //   switchMap(() => ['is-valid'])
    // );
  }

  getAddressFormValue(email: string) {
    this.accountService.getUserAddress().subscribe({
      next: (address: IAddress) => {
        if (address) {
          this.checkoutForm!.get('addressForm')?.patchValue({
            company: address.company,
            firstname: address.firstName,
            lastname: address.lastName,
            address: address.street,
            town: address.city,
            province: address.province,
            postalcode: address.zipCode,
            email: address.email,
            phone: address.telephone
          });
          this.checkZipcode = address.zipCode;

          // Workaround to fix <app-text-input> not show green tick when patchValue (go to other page and back to checkout and comment below 2 lines to see problem)
          this.fieldName!.nativeElement.focus();
          this.fieldName!.nativeElement.blur();
          
          this.checkoutForm!.get('addressForm')?.markAllAsTouched();
          this.checkoutForm!.get('addressForm')?.get('additionalMessage')?.markAsUntouched();
          this.onBlur(this.checkZipcode);

          if (address.company == '') {                  
            this.checkoutForm!.get('addressForm.company')?.markAsUntouched();
          }

          if (address.billing_FirstName != '' && address.billing_LastName != '' && address.billing_Street != '' && 
            address.billing_City != '' && address.billing_Province != '' && address.billing_ZipCode != '')
          {
            this.addressNull = false;
          }else {            
            this.addressNull = true;
          }
        }
        else {
          this.addressNull = true;
          this.checkoutForm!.get('addressForm')?.patchValue({
            email: email
          });          
          this.checkoutForm!.get('addressForm')?.get('email')?.markAsTouched();
        }
      },
      error: (e) => console.log(e)
    });
  }

  forceValue(control: any) {
    this.checkoutForm!.get('addressForm')?.get('phone')?.patchValue(control.target.value);
  }
  
  forceValueZipcodeForm(control: any) {
    this.checkoutForm!.get('addressForm')?.get('postalcode')!.setValue(control.target.value);
  }

  selectionChanged(event: any) {
    let idx = event.target.value;
    //console.log('id:', idx);
    this.checkoutForm!.get('addressForm')?.get('province')?.clearValidators();

    if (idx == '') {
      this.checkoutForm!.get('addressForm')?.get('province')?.setValidators([
        Validators.required
      ]);

      this.checkoutForm!.get('addressForm')?.get('province')?.setValue('');
    }
    this.checkoutForm!.updateValueAndValidity();
  }

  onBlur(currentZipcode?: string) {
    this.spinnerStatus = false;
    if (this.checkoutForm!.get('addressForm')?.get('postalcode')?.value === null) return;
    
    if (this.checkoutForm!.get('addressForm')?.get('postalcode')?.value !== currentZipcode) {
      this.checkZipcode = this.checkoutForm!.get('addressForm')?.get('postalcode')?.value;
      this.cartService.setZipcode(this.checkoutForm!.get('addressForm')?.get('postalcode')?.value.toString());
    }
  }

  copyAddress() {    
  	this.shopService.scrollToTop();
    
    if (!this.isLoggedIn) {
      this.checkoutForm!.get('billingForm')?.patchValue({
        b_company: this.checkoutForm!.get('addressForm')?.get('company')?.value,
        b_firstname: this.checkoutForm!.get('addressForm')?.get('firstname')?.value,
        b_lastname: this.checkoutForm!.get('addressForm')?.get('lastname')?.value,
        b_address: this.checkoutForm!.get('addressForm')?.get('address')?.value,
        b_town: this.checkoutForm!.get('addressForm')?.get('town')?.value,
        b_province: this.checkoutForm!.get('addressForm')?.get('province')?.value,
        b_postalcode: this.checkoutForm!.get('addressForm')?.get('postalcode')?.value,
        b_email: this.checkoutForm!.get('addressForm')?.get('email')?.value,
        b_phone: this.checkoutForm!.get('addressForm')?.get('phone')?.value,    
      });
      this.checkoutForm!.get('billingForm')?.markAllAsTouched();
      
      if (this.checkoutForm!.get('addressForm')?.get('company')?.value == '' || this.checkoutForm!.get('addressForm')?.get('company')?.value == null) {      
        this.checkoutForm!.get('billingForm.b_company')?.markAsUntouched();
      }
    } 
    else {
      if (this.addressNull) {
        this.checkoutForm!.get('billingForm')?.patchValue({
          b_company: this.checkoutForm!.get('addressForm')?.get('company')?.value,
          b_firstname: this.checkoutForm!.get('addressForm')?.get('firstname')?.value,
          b_lastname: this.checkoutForm!.get('addressForm')?.get('lastname')?.value,
          b_address: this.checkoutForm!.get('addressForm')?.get('address')?.value,
          b_town: this.checkoutForm!.get('addressForm')?.get('town')?.value,
          b_province: this.checkoutForm!.get('addressForm')?.get('province')?.value,
          b_postalcode: this.checkoutForm!.get('addressForm')?.get('postalcode')?.value,
          b_email: this.checkoutForm!.get('addressForm')?.get('email')?.value,
          b_phone: this.checkoutForm!.get('addressForm')?.get('phone')?.value,    
        });
        this.checkoutForm!.get('billingForm')?.markAllAsTouched();
      }
    }
  }
}
