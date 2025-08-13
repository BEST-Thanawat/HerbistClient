import { Injectable, Injector } from '@angular/core';
import { AccountService } from './account.service';
import { AnalyticsService } from './analytics.service';
import { CartService } from './cart.service';
import { LocalstorageService } from './localstorage.service';
import { AppService } from './app.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitialService {
  constructor(private router: Router, private injector: Injector, private cartService: CartService, private accountService: AccountService, private localStorageService: LocalstorageService, private analyticsService: AnalyticsService, private appService: AppService) { }

  initializeApp() {
    if (this.appService.isBrowser()) {
      // Show progress bar when route changed
      this.showProgressBar();      
      this.analyticsService.activateGtag();

      const token = this.localStorageService.getItem('token');
      const cartId = this.localStorageService.getItem('cart_id');
      this.loadCart(cartId!);

      if (token === null) {
        this.accountService.setNullCurrentUserSource();
      }

      try {
        firstValueFrom(this.injector.get(AccountService).loadCurrentUser(token)).catch(
          (e) => {
            console.log(e);
            this.localStorageService.removeItem('token');
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  private showProgressBar() {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          // this.busyService.show();
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          // this.busyService.hide();
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  loadCart(cartId: string) {
    if (cartId) {
      this.cartService.getCart(cartId).subscribe({
        next: () => {},
        error: (e) => {
          this.cartService.deleteCartById(cartId);
          console.error(e);
          this.router.navigateByUrl('');
        },
      });
    }
  }
}
