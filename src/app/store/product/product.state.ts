import { Product } from '../../models/product';
import { ProductCategory } from '../../models/product-category';

export interface ProductState {
    products: Product[];
    categories: ProductCategory[];
    currentProduct: Product | null;
    currentCategoryId: number | null;
    searchKeyword: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
    };
    loading: boolean;
    categoriesLoading: boolean;
    productDetailsLoading: boolean;
    error: string | null;
    productDetailsError: string | null;
}

export const initialProductState: ProductState = {
    products: [],
    categories: [],
    currentProduct: null,
    currentCategoryId: null,
    searchKeyword: null,
    pagination: {
        pageNumber: 1,
        pageSize: 5,
        totalElements: 0,
        totalPages: 0,
    },
    loading: false,
    categoriesLoading: false,
    productDetailsLoading: false,
    error: null,
    productDetailsError: null,
};
