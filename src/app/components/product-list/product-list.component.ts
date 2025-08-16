import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
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
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { createCartItem } from '../../common/models/cart-item';
import { Product } from '../../common/models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
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
export class ProductListComponent implements OnDestroy {
    products$: Observable<Product[]>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
    pagination$: Observable<any>;
    currentLanguage$: Observable<string>;

    currentCategoryId: number = 1;
    previousCategoryId: number = 1;
    searchMode: boolean = false;

    thePageNumber: number = 1;
    thePageSize: number = 5;
    theTotalElements: number = 0;

    previousKeyword: string = '';

    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];

    private subscriptions: Subscription[] = [];

    constructor(
        private productService: ProductService,
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
        this.route.paramMap.subscribe(() => {
            this.listProducts();
        });

        // Subscribe to pagination changes
        const paginationSub = this.pagination$.subscribe(pagination => {
            this.thePageNumber = pagination.pageNumber;
            this.thePageSize = pagination.pageSize;
            this.theTotalElements = pagination.totalElements;
        });

        this.subscriptions.push(paginationSub);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
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
            this.thePageNumber = 1;
        }

        this.previousKeyword = keyword;

        this.currentLanguage$.subscribe(language => {
            this.store.dispatch(
                ProductActions.searchProducts({
                    keyword,
                    page: this.thePageNumber - 1,
                    size: this.thePageSize,
                    language,
                })
            );
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
            this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        this.store.dispatch(ProductActions.setCurrentCategory({ categoryId: this.currentCategoryId }));

        this.currentLanguage$.subscribe(language => {
            this.store.dispatch(
                ProductActions.loadProductsByCategory({
                    categoryId: this.currentCategoryId,
                    page: this.thePageNumber - 1,
                    size: this.thePageSize,
                    language,
                })
            );
        });
    }

    updatePageSize(pageSize: string) {
        this.thePageSize = +pageSize;
        this.thePageNumber = 1;
        this.store.dispatch(
            ProductActions.setPagination({ pageNumber: this.thePageNumber, pageSize: this.thePageSize })
        );
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
        const rows = event.rows || this.thePageSize;

        this.thePageNumber = Math.floor(first / rows) + 1;
        this.thePageSize = rows;
        this.store.dispatch(
            ProductActions.setPagination({ pageNumber: this.thePageNumber, pageSize: this.thePageSize })
        );
        this.listProducts();
    }
}
