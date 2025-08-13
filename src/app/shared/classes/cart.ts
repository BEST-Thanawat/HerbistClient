import { v4 as uuidv4 } from 'uuid';

export interface ICart {
    id: string;
    items: ICartItem[];    
    clientSecret?: string;    
    paymentIntentId?: string;
    deliveryMethodId?: number;
    shippingPrice?: number;
    zipcode?: string;
}

export interface ICartItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    stock: number;
    pictureUrl: string | undefined;
    brand: string;
    type: string;

    sale: boolean;
    discount: number | undefined;
}

export class Cart implements ICart {
    id: string = uuidv4();
    items: ICartItem[] = [];
}

export interface ICartTotals {
    shipping?: number;
    subtotal?: number;
    total?: number;
    discount?: number;
}