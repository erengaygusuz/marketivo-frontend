import { createAction, props } from '@ngrx/store';
import { GetResponseProduct } from '../../models/get-response-product';
import { Product } from '../../models/product';
import { ProductCategory } from '../../models/product-category';

// Load categories
export const loadCategories = createAction('[Product] Load Categories', props<{ language: string }>());
export const loadCategoriesSuccess = createAction(
    '[Product] Load Categories Success',
    props<{ categories: ProductCategory[] }>()
);
export const loadCategoriesFailure = createAction('[Product] Load Categories Failure', props<{ error: string }>());

// Load products by category
export const loadProductsByCategory = createAction(
    '[Product] Load Products By Category',
    props<{ categoryId: number; page: number; size: number; language: string }>()
);
export const loadProductsByCategorySuccess = createAction(
    '[Product] Load Products By Category Success',
    props<{ response: GetResponseProduct }>()
);
export const loadProductsByCategoryFailure = createAction(
    '[Product] Load Products By Category Failure',
    props<{ error: string }>()
);

// Search products
export const searchProducts = createAction(
    '[Product] Search Products',
    props<{ keyword: string; page: number; size: number; language: string }>()
);
export const searchProductsSuccess = createAction(
    '[Product] Search Products Success',
    props<{ response: GetResponseProduct }>()
);
export const searchProductsFailure = createAction('[Product] Search Products Failure', props<{ error: string }>());

// Set current category
export const setCurrentCategory = createAction('[Product] Set Current Category', props<{ categoryId: number }>());

// Set pagination
export const setPagination = createAction(
    '[Product] Set Pagination',
    props<{ pageNumber: number; pageSize: number }>()
);

// Clear products
export const clearProducts = createAction('[Product] Clear Products');

// Reload data on language change
export const reloadDataOnLanguageChange = createAction(
    '[Product] Reload Data On Language Change',
    props<{ language: string; currentCategoryId?: number; searchKeyword?: string; page?: number; size?: number }>()
);

// Load product details
export const loadProductDetails = createAction(
    '[Product] Load Product Details',
    props<{ productId: number; language: string }>()
);
export const loadProductDetailsSuccess = createAction(
    '[Product] Load Product Details Success',
    props<{ product: Product }>()
);
export const loadProductDetailsFailure = createAction(
    '[Product] Load Product Details Failure',
    props<{ error: string }>()
);

// Clear current product
export const clearCurrentProduct = createAction('[Product] Clear Current Product');
