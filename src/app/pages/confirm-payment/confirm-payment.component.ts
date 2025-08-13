import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmPaymentStatus } from '../../shared/classes/confirmPayment';
import { IConfirmPayment } from '../../shared/classes/confirmPayment';
import { SeoService } from '../../shared/services/seo.service';
import { ShopService } from '../../shared/services/shop.service';
import { map, of, switchMap, timer } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { TextInputComponent } from "../../shared/components/text-input/text-input.component";
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.scss'],
  imports: [BreadcrumbComponent, TextInputComponent, BsDatepickerModule, TimepickerModule, CommonModule, RouterModule, TranslateModule, ReactiveFormsModule ]
})
export class ConfirmPaymentComponent implements OnInit {
  public paymentForm: FormGroup | undefined;
  public restrictionForm: UntypedFormGroup | undefined;
  public usageForm: UntypedFormGroup | undefined;
  // public model: NgbDateStruct | undefined;
  // public modelFooter: NgbDateStruct | undefined;
  public active = 1;
  date = { year: 0, month: 0, date: 0 };
  time = { hour: 0, minute: 0 };

  fileToUpload: File = null as any;
  touched = false;
  disabled = false;
  value: string | null = null;
  isValid = false;

  working = false
  uploadProgress: number | undefined;
  uploadUrl: string | undefined;
  validFileExtensions = [".tif", ".pjp", ".apng", ".xbm", ".jxl", ".svgz", ".pjp", ".jpg", ".jpeg", "icol", ".tiff", ".gif", ".svg", ".gfif", ".webp", ".png", ".bmp", ".pjpeg", ".avif"];

  bsValue = new Date();

  constructor(private seoService: SeoService, private formBuilder: UntypedFormBuilder, private shopService: ShopService, private orderService: OrderService, private router: Router) { //private calendar: NgbCalendar, 
    this.createPaymentForm();

    const now = new Date();
    this.date.year = now.getFullYear();
    this.date.month = now.getMonth() + 1;
    this.date.date = now.getDate();
    this.time.hour = now.getHours();
    this.time.minute = now.getMinutes();
  }

  ngOnInit() {
    this.seoService.setNormalPageTags('Confirm Payment(แจ้งชำระเงิน) | Herbist(เฮิบบิสท์) | เมล็ดพันธุ์สมุนไพรฝรั่ง โรสแมรี่ ลาเวนเดอร์ ผัก ดอกไม้นำเข้า'); 
    
    this.shopService.scrollToTop();
    this.paymentForm!.get('transfer_date')!.patchValue(this.bsValue);
    this.paymentForm!.get('transfer_time')!.patchValue(new Date());

    if (this.paymentForm!.get('transfer_date')!.status == 'VALID') {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  // private formatDate(date: any) {
  //   const d = new Date(date);
  //   let month = d.getMonth() + 1;
  //   let day = d.getDate();
  //   const year = d.getFullYear();
  //   const dateStruct: NgbDateStruct = { year: year, month: month, day: day };
  //   return dateStruct;
  // }

  selectToday() {
    //this.model = this.calendar.getToday();
  }

  createPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      ordernumber: [null, [Validators.required], [this.validateOrderNumber()]],
      amount: [null, [Validators.required]],
      transfer_date: ['', [Validators.required]],
      transfer_time: ['', [Validators.required]],
      formFile: ['', Validators.required]
    });
  }

  validateOrderNumber(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.orderService.getOrderByOrderNumber(control.value).pipe(
            map((response: any) => {
              if (response) {
                //console.log(response);
                if (response.status === 'Processing') {
                  return {wrongOrderStatus: true};
                }
                this.paymentForm!.get('firstname')!.patchValue(response.shipToAddress.firstName);
                this.paymentForm!.get('lastname')!.patchValue(response.shipToAddress.lastName);
                this.paymentForm!.get('email')!.patchValue(response.shipToAddress.email);
                this.paymentForm!.get('amount')!.patchValue(response.total);
                return null;
              }
              else {
                return {orderIsNotExists: true};
              }
              //return response ? null : {orderExists: true};
            })
          );
        })
      );
    }
  }

  onSubmit() {
    this.uploadUrl = '';
    this.uploadProgress = 0;
    this.working = true;

    const confirmPaymentToCreate = this.getConfirmPayment();
    this.shopService.submitConfirmPayment(confirmPaymentToCreate, this.fileToUpload).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          let resultCF: IConfirmPayment = event;
          //console.log(resultCF);
          if (resultCF.id != 0) {
            this.router.navigate(['/pages/confirm-payment/success']);
          }
        }
      },
      error: (e) => { console.error(e) },
      //complete: () => { console.info('load product types complete') }
    });
  }

  getConfirmPayment(): IConfirmPayment {
    let uploadDate = new Date(this.paymentForm!.get('transfer_date')!.value.getFullYear(),
      this.paymentForm!.get('transfer_date')!.value.getMonth(),
      this.paymentForm!.get('transfer_date')!.value.getDate(),
      this.paymentForm!.get('transfer_time')!.value.getHours(),
      this.paymentForm!.get('transfer_time')!.value.getMinutes());
    //console.log(uploadDate);
    //dateSubmit: Date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    return {
      id: 0,
      firstName: this.paymentForm!.get('firstname')!.value,
      lastName: this.paymentForm!.get('lastname')!.value,
      email: this.paymentForm!.get('email')!.value,
      orderNumber: this.paymentForm!.get('ordernumber')!.value,
      amount: this.paymentForm!.get('amount')!.value,
      slipURL: this.fileToUpload.name,
      status: ConfirmPaymentStatus.Waiting,
      dateTimeSubmit: uploadDate,
      createDate: new Date()
    };
  }

  onValueChange(value: Date): void {
    this.paymentForm!.get('transfer_date')!.markAsTouched();
    if (isFinite(+new Date(value))) {
      this.paymentForm!.get('transfer_date')!.patchValue(value);
    
      if (this.paymentForm!.get('transfer_date')!.status == 'VALID') {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    }else {
      this.isValid = false;
    }
  }

  // File Upload
  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files.item) {
      const ext = '.' + files.item(0)!.name.split('.')[1];

      if (ext) {
        //console.log(this.validFileExtensions.indexOf(ext) > -1);
        if (this.validFileExtensions.indexOf(ext) > -1) {
          this.fileToUpload = files.item(0)!;
          //console.log(this.fileToUpload);
        } else {
          this.paymentForm!.get('formFile')!.patchValue('');
        }
      } else {
        //this.isValid = false;
      }
    }

    // this.labelImport.nativeElement.innerText = Array.from(files)
    //   .map(f => f.name)
    //   .join(', ');
    // this.fileToUpload = files.item(0);

    //console.log(this.paymentForm!.get('formFile'));
  }
}