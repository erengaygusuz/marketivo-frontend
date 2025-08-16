import { Product } from '../../common/models/product';
import { ProductCategory } from '../../common/models/product-category';

export interface ProductState {
    products: Product[];
    categories: ProductCategory[];
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
    error: string | null;
}

export const initialProductState: ProductState = {
    products: [],
    categories: [],
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
    error: null,
};
