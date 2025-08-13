import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastrTranslateService {

  // , private snackBar: MatSnackBar
  constructor(private toastrService: ToastrService, private translateService: TranslateService) { } 

  show(message?: string, title?: string, override?: Partial<IndividualConfig>, type?: string): ActiveToast<any> {
    // this.snackBar.open(this.translate(message!), '');
    return this.toastrService.show(this.translate(message!), this.translate(title ?? ''), override, type);
  }

  success(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastrService.success(this.translate(message!), this.translate(title ?? ''), override);
  }

  error(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastrService.error(this.translate(message!), this.translate(title ?? ''), override);
  }

  info(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any> {
    // this.snackBar.open(this.translate(message!), '', { duration: 50000 });
    return this.toastrService.info(this.translate(message!), this.translate(title ?? ''), override);
  }

  warning(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any> {
    return this.toastrService.warning(this.translate(message!), this.translate(title ?? ''), override);
  }

  clear(toastId?: number): void {
    this.toastrService.clear(toastId);
  }
  
  remove(toastId: number): boolean {
    return this.toastrService.remove(toastId);
  }

  getTranslate(txt: string): string {
    return this.translateService.instant(txt);
  }

  onLangChange(): Observable<any> {
    return this.translateService.onLangChange;
  }

  showWithoutTranslate(message?: string) {
    return this.toastrService.show(message);
  }

  successWithoutTranslate(message?: string) {
    return this.toastrService.success(message);
  }

  errorWithoutTranslate(message?: string) {
    return this.toastrService.error(message);
  }

  infoWithoutTranslate(message?: string) {
    return this.toastrService.info(message);
  }

  warningWithoutTranslate(message?: string) {
    return this.toastrService.warning(message);
  }

  private translate(txt: string): string {
    if (txt.toString().trim() !== "") {
      return this.translateService.instant(txt);
    }

    return "";
  }
}
