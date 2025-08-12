import { ProductCategory } from '../models/product-category';

export interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    };
}
