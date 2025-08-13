import { ViewportScroller } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { IBankAccount } from '../classes/bankAccount';
import { ICart } from '../classes/cart';
import { IConfirmPayment } from '../classes/confirmPayment';
import { IDeliveryMethod } from '../classes/deliveryMethod';
import { IPaymentMethod } from '../classes/paymentMethod';
import { IReview } from '../classes/review';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  //public deliveryMethods: IDeliveryMethod[];

  private stepperIndexSource: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  stepperIndex$ = this.stepperIndexSource.asObservable();

  private mobileSidebarSource: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  mobileSidebar$ = this.mobileSidebarSource.asObservable();

  private mobileDashboardSidebarSource: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  mobileDashboardSidebar$ = this.mobileDashboardSidebarSource.asObservable();

  private cardValidatedSource = new BehaviorSubject<boolean>(false);
  cardValidated$ = this.cardValidatedSource.asObservable();

  paymentMethods: IPaymentMethod[] | undefined = [];
  bankAccounts: IBankAccount[] | undefined = [];
  deliveryMethods: IDeliveryMethod[] | undefined = [];

  private showFooterSource: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  showFooter$ = this.showFooterSource.asObservable();

  constructor(private http: HttpClient, private viewScroller: ViewportScroller) {
    //this.getPaymentMethods();
    this.getBankAccounts();
    this.stepperIndexSource.next(0);
    this.mobileSidebarSource.next(false);
    this.mobileDashboardSidebarSource.next(false);
  }

  async confirmPaymentWithStripe(cart: ICart | null, stripe: any, cardNumber: any, nameOnCard: string) {
    return stripe.confirmCardPayment(cart?.clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: {
          name: nameOnCard
        }
      }
    });
  }

  getStepperIndex(): Observable<any> {
    return this.stepperIndex$;
  }

  setStepperIndex(index: number) {
    this.stepperIndexSource.next(index);
    //console.log(index);
  }

  getMobileSidebar(): Observable<any> {
    return this.mobileSidebar$;
  }

  setMobileSidebar(set: boolean) {
    this.mobileSidebarSource.next(set);
    //console.log(set);
  }

  getMobileDashboardSidebar(): Observable<any> {
    return this.mobileDashboardSidebar$;
  }

  setMobileDashboardSidebar(set: boolean) {
    this.mobileDashboardSidebarSource.next(set);
    //console.log(set);
  }

  getCardValidated(): Observable<any> {
    return this.cardValidated$;
  }

  setCardValidated(set: boolean) {
    this.cardValidatedSource.next(set);
    //console.log(set);
  }

  getPaymentMethods() {
    //Get from cache
    if (this.paymentMethods !== undefined && this.paymentMethods.length > 0) {
      return of(this.paymentMethods);
    }

    return this.http.get<IPaymentMethod[]>(this.baseUrl + 'shop/getPaymentMethods').pipe(
      map((response: any) => {
        this.paymentMethods = response;
        return response;
      })
    );
  }

  getBankAccounts() {
    //Get from cache
    if (this.bankAccounts !== undefined && this.bankAccounts.length > 0) {
      return of(this.bankAccounts);
    }

    return this.http.get<IBankAccount[]>(this.baseUrl + 'shop/getBankAccounts').pipe(
      map((response: any) => {
        this.bankAccounts = response;
        return response;
      })
    );
  }

  getDeliveryMethods() {
    //Get from cache
    if (this.deliveryMethods !== undefined && this.deliveryMethods.length > 0) {
      return of(this.deliveryMethods);
    }

    return this.http.get<IDeliveryMethod[]>(this.baseUrl + 'shop/getDeliveryMethods').pipe(
      map((response: any) => {
        this.deliveryMethods = response;
        return response;
      })
    );
  }

  getAllConfirmPayments() {
    return this.http.get<IConfirmPayment[]>(this.baseUrl + 'shop/getAllConfirmPayments').pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  submitConfirmPayment(values: IConfirmPayment, file: File) {
    const httpOptions = {
      reportProgress: true,
      observe: 'events' as 'body',
      headers: new HttpHeaders({
        //'observe': 'events',
        //'ngsw-bypass': ''
        //'Content-Type': 'multipart/form-data'
        //'Authorization': `Bearer ${token}`
      })
    };

    const formData = new FormData();
    formData.append('file', file);
    //formData.append('confirmPayment', JSON.stringify(values));
    for (var prop in values) {
      if (prop == 'dateTimeSubmit' || prop == 'createDate') {
        formData.append(prop, values[prop].toUTCString());
      } else if (prop == 'email' || prop == 'id' || prop == 'amount' || prop == 'firstName' || prop == 'lastName' || prop == 'orderNumber' || prop == 'slipURL') {
        formData.append(prop, values[prop].toString());
      }
    }

    return this.http.post(this.baseUrl + 'shop/submitpayment', formData, httpOptions);
  }

  acceptConfirmPayment(id: number) {
    return this.http.post(this.baseUrl + 'shop/acceptConfirmPayment?id=' + id, null);
  }
  declineConfirmPayment(id: number) {
    return this.http.post(this.baseUrl + 'shop/declineConfirmPayment?id=' + id, null);
  }
  removeConfirmPayment(id: number) {
    return this.http.post(this.baseUrl + 'shop/removeConfirmPayment?id=' + id, null);
  }

  submitSubscribe(email: string) {
    return this.http.post(this.baseUrl + 'shop/subscribe?email=' + email, null);
  }

  getSubscribeEmail(email: string) {
    return this.http.get(this.baseUrl + 'shop/getSubscribeEmail?email=' + email);
  }

  scrollToTop() {
    setTimeout(() => {
      this.viewScroller.scrollToPosition([0, 0]);
      //console.log('Scroll To Top');
    }, 400);
  }

  submitNewReview(review: IReview) {    
    return this.http.post(this.baseUrl + 'products/addreview', review);
  }

  getShowFooter() :Observable<any> {
    return this.showFooter$;
  }

  setShowFooter(value: boolean) {    
    this.showFooterSource.next(value);
  }
}
