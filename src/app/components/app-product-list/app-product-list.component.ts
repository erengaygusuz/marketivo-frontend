import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { LanguageFacade } from '../../facades/language.facade';
import { ProductFacade } from '../../facades/product.facade';
import { createCartItem } from '../../models/cart-item';
import { Pagination } from '../../models/pagination';
import { PaginatorEvent } from '../../models/paginator-event';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './app-product-list.component.html',
    styleUrl: './app-product-list.component.scss',
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
export class AppProductListComponent implements OnInit, OnDestroy {
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
        private productFacade: ProductFacade,
        private languageFacade: LanguageFacade
    ) {
        this.products$ = this.productFacade.products$;
        this.loading$ = this.productFacade.productsLoading$;
        this.error$ = this.productFacade.productsErrorMessage$;
        this.pagination$ = this.productFacade.pagination$;
        this.currentLanguage$ = this.languageFacade.getCurrentLanguage();
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
            this.previousKeyword = '';
            this.handleListProducts();
        }
    }

    handleSearchProducts() {
        const keyword: string = this.route.snapshot.paramMap.get('keyword')!;
        const trimmedKeyword = keyword?.trim();

        if (!trimmedKeyword || trimmedKeyword.length === 0) {
            this.searchMode = false;
            this.previousKeyword = '';
            this.productFacade.clearProducts();
            this.handleListProducts();

            return;
        }

        if (this.previousKeyword !== keyword) {
            this.productFacade.setPagination(1, 5);
        }

        this.previousKeyword = keyword;

        this.currentLanguage$.pipe(take(1), takeUntil(this.destroy$)).subscribe(language => {
            this.pagination$.pipe(take(1), takeUntil(this.destroy$)).subscribe(pagination => {
                this.productFacade.searchProducts(keyword, pagination.pageNumber, pagination.pageSize, language);
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
            this.productFacade.setPagination(1, 5);
        }

        this.previousCategoryId = this.currentCategoryId;

        this.productFacade.setCurrentCategory(this.currentCategoryId);

        this.currentLanguage$.pipe(take(1), takeUntil(this.destroy$)).subscribe(language => {
            this.pagination$.pipe(take(1), takeUntil(this.destroy$)).subscribe(pagination => {
                this.productFacade.loadProductsByCategory(
                    this.currentCategoryId,
                    pagination.pageNumber - 1,
                    pagination.pageSize,
                    language
                );
            });
        });
    }

    updatePageSize(pageSize: string) {
        const newPageSize = +pageSize;

        this.productFacade.setPagination(1, newPageSize);

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

        this.productFacade.setPagination(pageNumber, rows);

        this.listProducts();
    }
}
