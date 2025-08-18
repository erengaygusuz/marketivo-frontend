import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { MessageModule } from 'primeng/message';
import { OrderListModule } from 'primeng/orderlist';
import { PaginatorModule } from 'primeng/paginator';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { createCartItem } from '../../common/models/cart-item';
import { Product } from '../../common/models/product';
import { CartService } from '../../services/cart.service';
import { AppState } from '../../store/app.state';
import { selectCurrentLanguage } from '../../store/language/language.selectors';
import * as ProductActions from '../../store/product/product.actions';
import {
    selectPagination,
    selectProductError,
    selectProducts,
    selectProductsLoading,
} from '../../store/product/product.selectors';

interface PaginatorEvent {
    first?: number;
    rows?: number;
    page?: number;
    pageCount?: number;
}

interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        DataViewModule,
        SelectButtonModule,
        TagModule,
        ButtonModule,
        PickListModule,
        OrderListModule,
        MessageModule,
        PaginatorModule,
        TranslateModule,
    ],
})
export class ProductListComponent implements OnInit, OnDestroy {
    products$: Observable<Product[]>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
    pagination$: Observable<Pagination>;
    currentLanguage$: Observable<string>;

    currentCategoryId: number = 1;
    previousCategoryId: number = 1;
    searchMode: boolean = false;

    previousKeyword: string = '';

    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];

    private destroy$ = new Subject<void>();

    constructor(
        private cartService: CartService,
        private route: ActivatedRoute,
        private store: Store<AppState>
    ) {
        this.products$ = this.store.select(selectProducts);
        this.loading$ = this.store.select(selectProductsLoading);
        this.error$ = this.store.select(selectProductError);
        this.pagination$ = this.store.select(selectPagination);
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.listProducts();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    listProducts() {
        this.searchMode = this.route.snapshot.paramMap.has('keyword');

        if (this.searchMode) {
            this.handleSearchProducts();
        } else {
            this.handleListProducts();
        }
    }

    handleSearchProducts() {
        const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

        if (this.previousKeyword !== keyword) {
            // Reset to page 1 when keyword changes
            this.store.dispatch(ProductActions.setPagination({ pageNumber: 1, pageSize: 5 }));
        }

        this.previousKeyword = keyword;

        // Get current pagination and language from store
        this.currentLanguage$.pipe(take(1), takeUntil(this.destroy$)).subscribe(language => {
            this.pagination$.pipe(take(1), takeUntil(this.destroy$)).subscribe(pagination => {
                this.store.dispatch(
                    ProductActions.searchProducts({
                        keyword,
                        page: pagination.pageNumber - 1,
                        size: pagination.pageSize,
                        language,
                    })
                );
            });
        });
    }

    handleListProducts() {
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if (hasCategoryId) {
            this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
        } else {
            this.currentCategoryId = 1;
        }

        if (this.previousCategoryId != this.currentCategoryId) {
            // Reset to page 1 when category changes
            this.store.dispatch(ProductActions.setPagination({ pageNumber: 1, pageSize: 5 }));
        }

        this.previousCategoryId = this.currentCategoryId;

        this.store.dispatch(ProductActions.setCurrentCategory({ categoryId: this.currentCategoryId }));

        // Get current pagination and language from store
        this.currentLanguage$.pipe(take(1), takeUntil(this.destroy$)).subscribe(language => {
            this.pagination$.pipe(take(1), takeUntil(this.destroy$)).subscribe(pagination => {
                this.store.dispatch(
                    ProductActions.loadProductsByCategory({
                        categoryId: this.currentCategoryId,
                        page: pagination.pageNumber - 1,
                        size: pagination.pageSize,
                        language,
                    })
                );
            });
        });
    }

    updatePageSize(pageSize: string) {
        const newPageSize = +pageSize;

        this.store.dispatch(ProductActions.setPagination({ pageNumber: 1, pageSize: newPageSize }));
        this.listProducts();
    }

    addToCart(product: Product) {
        this.currentLanguage$.pipe(take(1)).subscribe((language: string) => {
            const cartItem = createCartItem(product, language);

            this.cartService.addToCart(cartItem);
        });
    }

    onPageChange(event: PaginatorEvent) {
        const first = event.first || 0;
        const rows = event.rows || 5;

        const pageNumber = Math.floor(first / rows) + 1;

        this.store.dispatch(ProductActions.setPagination({ pageNumber, pageSize: rows }));
        this.listProducts();
    }
}
