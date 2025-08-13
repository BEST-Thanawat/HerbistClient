import { Component, OnInit, Input } from '@angular/core';
import { AsyncValidatorFn, FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { map, of, switchMap, timer } from 'rxjs';
import { ShopService } from '../../services/shop.service';
import { ToastrTranslateService } from '../../services/toastr-translate.service';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from "../../components/text-input/text-input.component";

@Component({
  selector: 'app-footer-one',
  imports: [CommonModule, TranslateModule, RouterModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './footer-one.component.html',
  styleUrls: ['./footer-one.component.scss']
})
export class FooterOneComponent implements OnInit {
  logoImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/icon/herbist.png' : "assets/images/icon/herbist.png";
  dbdImg = environment.cloudinary ? environment.cloudinaryURL + '/' + environment.cloudinaryId + '/assets/images/dbd_creditcard.png' : "assets/images/dbd_creditcard.png";

  @Input() class: string = 'footer-light'; // Default class 
  @Input() themeLogo: string = this.logoImg; //'assets/images/icon/herbist.png'; // Default Logo
  @Input() newsletter: boolean = true; // Default True
  @Input() dbd: string = this.dbdImg;

  public today: number = Date.now();

  public subscribeForm: FormGroup | undefined;
  showImg: boolean = false;

  constructor(private tts: ToastrTranslateService, private formBuilder: UntypedFormBuilder, private shopService: ShopService) {
    this.createSubscribeForm();
  }

  ngOnInit(): void {
  }

  createSubscribeForm() {
    this.subscribeForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')], [this.validateEmail()]],
    });
  }

  onSubmit() {
    this.shopService.submitSubscribe(this.subscribeForm!.controls['email'].value).subscribe({
      next: () => {
        this.subscribeForm!.controls['email'].patchValue('');
        this.subscribeForm!.controls['email'].markAsUntouched();
        this.subscribeForm!.controls['email'].markAsPristine();
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => { 
        this.tts.success('Subscribed Successfully');
      }
    });
  }

  validateEmail(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.shopService.getSubscribeEmail(control.value).pipe(
            map((response: any) => {
              if (response) {
                //Already subscribed
                this.tts.warning('You have already subscribed. Thank you!');
                //this.subscribeForm.controls.email.patchValue('');
                // this.subscribeForm.controls.email.markAsUntouched();
                // this.subscribeForm.controls.email.markAsPristine();
                return {subscribeExists: true};                
              }
              else {
                //New subscriber
                return null;
              }
            })
          );
        })
      );
    }
  }
}
