import { IAddress } from "./address"
import { IPaymentMethod } from './paymentMethod';
import { IDeliveryMethod } from './deliveryMethod';
import { ICoupon } from './coupon';

export interface IOrderToCreate {
    cartId: string
    deliveryMethodId: number
    shipToAddress: IAddress
    paymentMethodId: number
    couponCode: string
}

export interface IOrder {
    id: number
    orderNumber: string
    buyerEmail: string
    orderDate: string
    shipToAddress: IAddress
    paymentMethod: IPaymentMethod
    deliveryMethod: IDeliveryMethod
    trackingNumber: string
    shippingPrice: number
    orderItems: IOrderItem[]
    subTotal: number
    total: number
    discount: number
    status: string
    paymentIntentId: string
    coupon: ICoupon
    couponDiscount: number
}

export interface IOrderToUpdate {
    id: number
    orderNumber: string
    buyerEmail: string
    orderDate: string
    shipToAddress: IAddress
    paymentMethod: IPaymentMethod
    deliveryMethod: IDeliveryMethod
    trackingNumber: string
    shippingPrice: number
    orderItems: IOrderItem[]
    subTotal: number
    total: number
    discount: number
    status: OrderStatus
    coupon: ICoupon
    couponDiscount: number  
}

export interface IOrderItem {
    //Use this class for 2 cases(checkout success and order success)
    productId: number
    productName: string
    pictureUrl: string

    itemOrdered : IProductItemOrdered
    price: number
    quantity: number
    sale: boolean
    discount: number
}

export interface IProductItemOrdered {
    productItemId: number
    productName: string
    pictureUrl: string
    CidPictureUrl: number
}

export enum OrderStatus {
    Pending = "Pending",
    WaitingPayment = "Wait for Payment",
    Processing = "Processing",
    PaymentFailed = "Payment Failed",
    Shipped = "Shipped",
    Canceled = "Canceled",
    Refunded = "Refunded"
}