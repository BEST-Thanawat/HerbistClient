import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject, PLATFORM_ID } from '@angular/core'; // Important!
import { ToastrTranslateService } from '../../services/toastr-translate.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // const toastrTranslateService = inject(ToastrTranslateService); // Inject the service
  const router = inject(Router); // Inject the service
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(error.error);

      let errorMessage = 'An unknown error occurred!';

      if (isPlatformBrowser(platformId) && error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${error.error.message}`;
      } else {
        const navigationExtras: NavigationExtras = { state: { error: error.error } };

        // Server-side errors
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        // You can add more specific handling based on error.status
        switch (error.status) {
          case 400: {
            //Handle error at client
            if (error.error.statusCode == 400) {
              //{statusCode: 401, message: 'Login failed'}
              return throwError(() => error.error);
            }

            // if (error.error.errors) {
            //   // toastrTranslateService.error(error.error.message + error.error.statusCode);
            //   return throwError(() => error.error);
            // } else {
            //   // toastrTranslateService.error(error.error.message + error.error.statusCode);
            // }
            // console.log(400)
            // router.navigateByUrl('/pages/server-error', navigationExtras);
            break;
          }
          case 401:
            //Handle error at client
            if (error.error.statusCode == 401) {
              //{statusCode: 401, message: 'Login failed'}
              return throwError(() => error.error);
            }

            // if (error.error.statusCode === 401) {
            //   // toastrTranslateService.error('wrong password');
            // } else {
            //   // toastrTranslateService.error(error.error.message + ' (' + error.error.statusCode + ')');
            // }
            // console.log(401)
            // router.navigateByUrl('/pages/server-error', navigationExtras);
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
      // console.error(errorMessage);
      // Re-throw the error to be caught by the component or service
      return throwError(() => new Error(errorMessage));
    })
  );
};
