import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.method === 'POST' && request.url.includes('orders')) {
            return next.handle(request);
        }

        if (request.method === 'POST' && request.url.includes('changepassword')) {
            return next.handle(request);
        }

        if (request.method === 'DELETE') {
            return next.handle(request);
        }

        if (
            request.url.includes('account/register') ||
            request.url.includes('emailexists') ||
            request.url.includes('products/collectionsdistinct') ||
            request.url.includes('products/brands') ||
            request.url.includes('products/tagsdistinct') ||
            request.url.includes('products/types') ||
            request.url.includes('orders/checkingPaymentStatus') ||
            request.url.includes('products/getrelatedproducts') ||
            request.url.includes('products/getallnewproducts')) {
            return next.handle(request);
        }
        
        // if (request.url.includes('cart')) {
        //     this.busyService.busyBackground();
        // }
        // else {
        //     this.busyService.busy();
        // }
        //this.busyService.show();

        return next.handle(request).pipe(
            //delay(500),
            finalize(() => {
                // this.busyService.idleBackground();
                // this.busyService.idle();

                // this.busyService.hide()
            })
        );
    }
}
