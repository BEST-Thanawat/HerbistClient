import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cart } from '../classes/cart';
import { IOrder, IOrderToCreate, IOrderToUpdate } from '../classes/order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrder(order: IOrderToCreate) {
    return this.http.post(this.baseUrl + 'orders', order);
  }

  checkingPaymentStatus(paymentIntentId: string): Observable<IOrder> {
    return this.http.get(this.baseUrl + 'orders/checkingPaymentStatus?paymentIntentId=' + paymentIntentId).pipe(
      map((order: IOrder | any) => {
        return order;
      })
    );
  }

  getOrderForUser() {
    return this.http.get(this.baseUrl + 'orders');
  }

  getSuccessOrderForUser() {
    return this.http.get(this.baseUrl + 'orders/getSuccessOrderForUser');
  }

  getOrderForUserById(id: number) {
    return this.http.get(this.baseUrl + 'orders/' + id);
  }

  getOrderById(id: number) {
    return this.http.get(this.baseUrl + 'orders/getOrderById?id=' + id);
  }

  getOrderByOrderNumber(orderNumber: number) {
    return this.http.get(this.baseUrl + 'orders/getOrderByOrderNumber?orderNumber=' + orderNumber);
  }

  getAllOrder() {
    return this.http.get(this.baseUrl + 'orders/getAllOrder');
  }

  getDeliveryMethods(cart: Cart) {
    return this.http.post(this.baseUrl + 'orders/deliveryMethods', cart).pipe(
      map((dm: any) => {
        return dm.sort((a: { price: number }, b: { price: number }) => a.price - b.price);
      })
    );
  }

  updateTrackingNumber(id: number, tracking: string) {
    return this.http.post(this.baseUrl + 'orders/updateTrackingNumber?id=' + id + '&trackingno=' + tracking, null);
  }

  updateOrder(order: IOrderToUpdate) {
    return this.http.post(this.baseUrl + 'orders/updateOrder', order);
  }

  getCouponByCode(code: string) {
    return this.http.get(this.baseUrl + 'orders/getCouponByCode?code=' + code);
  }
}
