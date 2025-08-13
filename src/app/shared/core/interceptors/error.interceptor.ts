import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrTranslateService } from '../../services/toastr-translate.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private tts: ToastrTranslateService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          if (error.status === 400){
            if (error.error.errors) {
              this.tts.error(error.error.message + error.error.statusCode);
              throw error.error;
            } else {
              this.tts.error(error.error.message + error.error.statusCode);
            }
          }
          if (error.status === 401){
            // console.log(error.error.message)
            // console.log(error.error.statusCode)
            if (error.error.statusCode === 401) { 
              this.tts.error('wrong password');
            } else {
              this.tts.error(error.error.message + ' (' + error.error.statusCode + ')');
            }
          }
          if (error.status === 403){
            this.router.navigateByUrl('/pages/forbidden');
          }
          if (error.status === 404){
            this.router.navigateByUrl('/pages/not-found');
          }
          if (error.status === 500){
            const navigationExtras: NavigationExtras = {state: {error: error.error}}; //, ignoreLoadingBar: true
            this.router.navigateByUrl('/pages/server-error', navigationExtras, );
          }
        }

        return throwError(() => error);
      })
    );
  }
}
