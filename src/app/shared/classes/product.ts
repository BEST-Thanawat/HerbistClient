import { IReview } from "./review";

// Products
export interface Product {
    id?: number;
    title?: string;
    description?: string;
    type?: string;
    brand?: string;
    collection?: any[];
    category?: string;
    price?: number;
    sale?: boolean;
    discount?: number;
    stock?: number;
    new?: boolean;
    quantity?: number;
    tags?: any[];
    variants?: Variants[];
    images?: Images[];
}

export interface Variants {
    variant_id?: number;
    id?: number;
    sku?: string;
    size?: string;
    color?: string;
    image_id?: number;
}

export interface Images {
    image_id?: number;
    id?: number;
    alt?: string;
    src?: string;
    variant_id?: any[];
    imageOrder?: number;
    productId?: number;
    responsiveSrcSet: string;
}

export interface IProduct {
    id: number;
    name: string;
    description: string;
    descriptionSeedCount: string;
    productType: string;
    productTypeId: number;
    productBrand: string;
    productBrandId: number;
    collections: string[];
    price: number;
    sale: boolean;
    discount?: number;
    stock: number;
    quantity?: number;
    isNew: boolean;
    tags: string[];
    variants: Variants[];
    images: Images[];
    reviews: IReview[];
    isOrganic: boolean;
    isHeirloom: boolean;
    isButterfly: boolean;
    isHummingbird: boolean;
    isPollinators: boolean;
    isGreatInContainers: boolean;
    isPrimedSeed: boolean;
    detailsSeedCount: string;
    detailsScientificName: string;
    detailsHowToGerm: string;
    detailsDayToGerm: string;
    detailsLength: string;
    detailsHeight: string;
    detailsCompost: string;
    detailsLighting: string;
    detailsType: string;
    detailsPropagation: string;
    detailsDayToMaturity: string;
    detailsHowToGrow1: string;
    detailsHowToGrow2: string;
    detailsHowToGrow3: string;
    detailsHowToGrow4: string;
    feature: string;
}