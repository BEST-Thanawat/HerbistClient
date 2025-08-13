import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService } from '../../services/app.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalstorageService,
    private appService: AppService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.appService.isBrowser()) {
      const token = this.localStorageService.getItem('token');
      // console.log(token);
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return next.handle(req);
    }

    return next.handle(req);
    // const token = localStorage.getItem('token');

    // if (token) {
    //   req = req.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   });
    // }

    // return next.handle(req);
  }
}
