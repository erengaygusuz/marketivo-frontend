import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { initialProductState } from './product.state';

export const productReducer = createReducer(
    initialProductState,

    // Load categories
    on(ProductActions.loadCategories, state => ({
        ...state,
        categoriesLoading: true,
        error: null,
    })),

    on(ProductActions.loadCategoriesSuccess, (state, { categories }) => ({
        ...state,
        categories,
        categoriesLoading: false,
        error: null,
    })),

    on(ProductActions.loadCategoriesFailure, (state, { error }) => ({
        ...state,
        categoriesLoading: false,
        error,
    })),

    // Load products by category
    on(ProductActions.loadProductsByCategory, state => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(ProductActions.loadProductsByCategorySuccess, (state, { response }) => ({
        ...state,
        products: response._embedded.products,
        pagination: {
            pageNumber: response.page.number + 1,
            pageSize: response.page.size,
            totalElements: response.page.totalElements,
            totalPages: response.page.totalPages,
        },
        loading: false,
        error: null,
    })),

    on(ProductActions.loadProductsByCategoryFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Search products
    on(ProductActions.searchProducts, (state, { keyword }) => ({
        ...state,
        searchKeyword: keyword,
        loading: true,
        error: null,
    })),

    on(ProductActions.searchProductsSuccess, (state, { response }) => ({
        ...state,
        products: response._embedded.products,
        pagination: {
            pageNumber: response.page.number + 1,
            pageSize: response.page.size,
            totalElements: response.page.totalElements,
            totalPages: response.page.totalPages,
        },
        loading: false,
        error: null,
    })),

    on(ProductActions.searchProductsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Set current category
    on(ProductActions.setCurrentCategory, (state, { categoryId }) => ({
        ...state,
        currentCategoryId: categoryId,
    })),

    // Set pagination
    on(ProductActions.setPagination, (state, { pageNumber, pageSize }) => ({
        ...state,
        pagination: {
            ...state.pagination,
            pageNumber,
            pageSize,
        },
    })),

    // Clear products
    on(ProductActions.clearProducts, state => ({
        ...state,
        products: [],
        pagination: {
            pageNumber: 1,
            pageSize: 5,
            totalElements: 0,
            totalPages: 0,
        },
    }))
);
