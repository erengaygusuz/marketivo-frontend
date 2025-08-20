import { Product } from './product';

export interface GetResponseProduct {
    _embedded?: {
        products: Product[];
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}
