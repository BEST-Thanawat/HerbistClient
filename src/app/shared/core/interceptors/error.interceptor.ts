import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core'; // Important!
import { ToastrTranslateService } from '../../services/toastr-translate.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // const toastrTranslateService = inject(ToastrTranslateService); // Inject the service
  const router = inject(Router); // Inject the service

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${error.error.message}`;
      } else {
        const navigationExtras: NavigationExtras = { state: { error: error.error } };

        // Server-side errors
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        // You can add more specific handling based on error.status
        switch (error.status) {
          case 400: {
            // if (error.error.errors) {
            //   // toastrTranslateService.error(error.error.message + error.error.statusCode);
            //   return throwError(() => error.error);
            // } else {
            //   // toastrTranslateService.error(error.error.message + error.error.statusCode);
            // }
            router.navigateByUrl('/pages/server-error', navigationExtras);
            break;
          }
          case 401:
            // if (error.error.statusCode === 401) {
            //   // toastrTranslateService.error('wrong password');
            // } else {
            //   // toastrTranslateService.error(error.error.message + ' (' + error.error.statusCode + ')');
            // }
            router.navigateByUrl('/pages/server-error', navigationExtras);
            break;
          case 403:
            router.navigateByUrl('/pages/forbidden');
            break;
          case 404:
            router.navigateByUrl('/pages/not-found');
            break;
          case 500:
            router.navigateByUrl('/pages/server-error', navigationExtras);
            break;
          // Add more cases for specific HTTP status codes
        }
      }
      console.error(errorMessage);
      // Re-throw the error to be caught by the component or service
      return throwError(() => new Error(errorMessage));
    })
  );
};
