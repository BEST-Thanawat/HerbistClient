export interface IReview {
    id?: number;
    productId: number;
    buyerEmail: string;
    buyerName: string;
    rating: number;
    text: string;
    reviewDate?: Date
}

// export class Review {
//     id: number | undefined;
//     productId: number | undefined;
//     buyerEmail: string | undefined;
//     buyerName: string | undefined;
//     rating: number | undefined;
//     text: string | undefined;
//     reviewDate: string | undefined;
// }