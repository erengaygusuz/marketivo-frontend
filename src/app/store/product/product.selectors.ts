import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.state';

export const selectProductState = createFeatureSelector<ProductState>('product');

export const selectProducts = createSelector(selectProductState, (state: ProductState) => state?.products || []);

export const selectCategories = createSelector(selectProductState, (state: ProductState) => state?.categories || []);

export const selectCurrentCategoryId = createSelector(
    selectProductState,
    (state: ProductState) => state?.currentCategoryId
);

export const selectSearchKeyword = createSelector(selectProductState, (state: ProductState) => state?.searchKeyword);

export const selectPagination = createSelector(
    selectProductState,
    (state: ProductState) =>
        state?.pagination || {
            pageNumber: 1,
            pageSize: 5,
            totalElements: 0,
            totalPages: 0,
        }
);

export const selectProductsLoading = createSelector(
    selectProductState,
    (state: ProductState) => state?.loading || false
);

export const selectCategoriesLoading = createSelector(
    selectProductState,
    (state: ProductState) => state?.categoriesLoading || false
);

export const selectProductsError = createSelector(selectProductState, (state: ProductState) => state?.error || null);

export const selectProductById = (id: number) =>
    createSelector(selectProducts, products => products.find(product => product.id === id));

export const selectCategoryById = (id: number) =>
    createSelector(selectCategories, categories => categories.find(category => category.id === id));

export const selectCurrentProduct = createSelector(selectProductState, (state: ProductState) => state?.currentProduct);

export const selectProductDetailsLoading = createSelector(
    selectProductState,
    (state: ProductState) => state?.productDetailsLoading || false
);

export const selectProductDetailsError = createSelector(
    selectProductState,
    (state: ProductState) => state?.productDetailsError || null
);
