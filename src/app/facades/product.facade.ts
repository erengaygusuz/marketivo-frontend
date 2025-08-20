import { AppState } from '@/store/app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';
import * as ProductActions from '../store/product/product.actions';
import {
    selectCategories,
    selectCategoriesLoading,
    selectCurrentProduct,
    selectPagination,
    selectProductDetailsError,
    selectProductDetailsLoading,
    selectProducts,
    selectProductsError,
    selectProductsLoading,
} from '../store/product/product.selectors';

@Injectable({
    providedIn: 'root',
})
export class ProductFacade {
    constructor(private store: Store<AppState>) {}

    get currentProduct$(): Observable<Product | null> {
        return this.store.select(selectCurrentProduct);
    }

    get currentProductLoading$(): Observable<boolean> {
        return this.store.select(selectProductDetailsLoading);
    }

    get currentProductErrorMessage$(): Observable<string | null> {
        return this.store.select(selectProductDetailsError);
    }

    loadProductDetails(productId: number, language: string): void {
        this.store.dispatch(ProductActions.loadProductDetails({ productId, language }));
    }

    clearCurrentProduct(): void {
        this.store.dispatch(ProductActions.clearCurrentProduct());
    }

    get products$(): Observable<Product[]> {
        return this.store.select(selectProducts);
    }

    get productsLoading$(): Observable<boolean> {
        return this.store.select(selectProductsLoading);
    }

    get productsErrorMessage$(): Observable<string | null> {
        return this.store.select(selectProductsError);
    }

    get pagination$(): Observable<Pagination> {
        return this.store.select(selectPagination);
    }

    clearProducts(): void {
        this.store.dispatch(ProductActions.clearProducts());
    }

    setPagination(pageNumber: number, pageSize: number): void {
        this.store.dispatch(ProductActions.setPagination({ pageNumber: pageNumber, pageSize: pageSize }));
    }

    searchProducts(keyword: string, pageNumber: number, pageSize: number, language: string): void {
        this.store.dispatch(ProductActions.searchProducts({ keyword, page: pageNumber, size: pageSize, language }));
    }

    setCurrentCategory(categoryId: number): void {
        this.store.dispatch(ProductActions.setCurrentCategory({ categoryId }));
    }

    loadProductsByCategory(categoryId: number, pageNumber: number, pageSize: number, language: string): void {
        this.store.dispatch(
            ProductActions.loadProductsByCategory({ categoryId, page: pageNumber, size: pageSize, language })
        );
    }

    get categories$(): Observable<ProductCategory[]> {
        return this.store.select(selectCategories);
    }

    get categoriesLoading$(): Observable<boolean> {
        return this.store.select(selectCategoriesLoading);
    }

    loadCategories(language: string): void {
        this.store.dispatch(ProductActions.loadCategories({ language }));
    }
}
