export interface IDeliveryMethod {
    id: number
    shortName: string
    description: string
    price: number
    additionalPrice: number
    remoteAreaAdditionalPrice: number
    total: number
    freeCondition: number
}