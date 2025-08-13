import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Routes, UrlTree } from "@angular/router";
import { DashboardAddressbookComponent } from "./account/dashboard-addressbook/dashboard-addressbook.component";
import { DashboardChangepasswordComponent } from "./account/dashboard-changepassword/dashboard-changepassword.component";
import { DashboardOrderComponent } from "./account/dashboard-order/dashboard-order.component";
import { DashboardComponent } from "./account/dashboard/dashboard.component";
import { ForgetPasswordSentComponent } from "./account/forget-password-sent/forget-password-sent.component";
import { ForgetPasswordComponent } from "./account/forget-password/forget-password.component";
import { LoginComponent } from "./account/login/login.component";
import { RegisterComponent } from "./account/register/register.component";
import { ResetPasswordSuccessComponent } from "./account/reset-password-success/reset-password-success.component";
import { ResetPasswordComponent } from "./account/reset-password/reset-password.component";
import { ConfirmPaymentSuccessComponent } from "./confirm-payment-success/confirm-payment-success.component";
import { ConfirmPaymentComponent } from "./confirm-payment/confirm-payment.component";
import { ErrorForbiddenComponent } from "./error-forbidden/error-forbidden.component";
import { ErrorNotfoundComponent } from "./error-notfound/error-notfound.component";
import { ErrorComponent } from "./error/error.component";
import { OrderSuccessComponent } from "./order-success/order-success.component";
import { isPlatformBrowser } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";
import { Observable, of } from "rxjs";
import { AccountService } from "../shared/services/account.service";

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const accountService = inject(AccountService);
  //const router = inject(Router);

  const platf = inject(PLATFORM_ID);
  if (isPlatformBrowser(platf)) {
    return accountService.getAuth();
  } else {
    return of(false);
  }
};

export const pages: Routes = [
  { 
    path: 'dashboard',
    canActivate: [canActivate],//[AuthGuard],
    component: DashboardComponent,
  },
  { 
    path: 'dashboard/addressbook',
    canActivate: [canActivate],//[AuthGuard],
    component: DashboardAddressbookComponent
  },
  { 
    path: 'dashboard/order',
    canActivate: [canActivate],//[AuthGuard],
    component: DashboardOrderComponent
  },
  { 
    path: 'dashboard/changepassword',
    canActivate: [canActivate],//[AuthGuard],
    component: DashboardChangepasswordComponent
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'forget/password', 
    component: ForgetPasswordComponent 
  },
  { 
    path: 'forget/password/sent', 
    component: ForgetPasswordSentComponent 
  },
  { 
    path: 'reset/password', 
    component: ResetPasswordComponent 
  }, 
  { 
    path: 'reset/password/success', 
    component: ResetPasswordSuccessComponent 
  },
  // { 
  //   path: 'aboutus', 
  //   component: AboutUsComponent 
  // },
  // { 
  //   path: 'search', 
  //   component: SearchComponent 
  // },
  { 
    path: 'order/success/:id', 
    component: OrderSuccessComponent 
  },
  { 
    path: '404', 
    component: ErrorComponent 
  },
  { 
    path: 'confirm-payment', 
    component: ConfirmPaymentComponent 
  },
  { 
    path: 'confirm-payment/success', 
    component: ConfirmPaymentSuccessComponent 
  },
  // { 
  //   path: 'error-test', 
  //   component: ErrorTestComponent 
  // },
  { 
    path: 'not-found', 
    component: ErrorNotfoundComponent 
  },
  { 
    path: 'forbidden', 
    component: ErrorForbiddenComponent 
  },
  { 
    path: 'server-error', 
    component: ErrorComponent 
  }
];