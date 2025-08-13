export interface IConfirmPayment {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    orderNumber: string,
    amount: number,
    slipURL: string,
    status: ConfirmPaymentStatus,
    dateTimeSubmit: Date,
    createDate: Date
}

export enum ConfirmPaymentStatus
{
    Waiting = 0,
    Confirmed = 1,
    Declined = 2,
    Removed = 3
}