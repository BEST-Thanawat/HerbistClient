import { IProduct } from "./product";

export interface ICoupon {
    id: number,
    code: string,
    description: string,
    discount: number,
    timeUsed: number,
    limit: number,
    onlyForEmail: string,
    forProducts: IProduct[],
    validDate: Date,
    expiredDate: Date
}

export interface ICouponToReturnDto
{
    coupon: ICoupon,
    error: string
}