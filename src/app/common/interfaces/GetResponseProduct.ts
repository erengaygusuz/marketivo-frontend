import { Product } from '../models/product';

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
