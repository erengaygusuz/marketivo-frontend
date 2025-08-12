import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { GetResponseProduct } from '../../common/interfaces/GetResponseProduct';
import { CartItem } from '../../common/models/cart-item';
import { Product } from '../../common/models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

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
export class ProductListComponent {
    products: Product[] = [];
    currentCategoryId: number = 1;
    previousCategoryId: number = 1;
    searchMode: boolean = false;
    isLoading: boolean = true;
    errorMessage: string = '';

    thePageNumber: number = 1;
    thePageSize: number = 5;
    theTotalElements: number = 0;

    previousKeyword: string = '';

    layout: 'list' | 'grid' = 'list';

    options = ['list', 'grid'];

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => {
            this.listProducts();
        });
    }

    listProducts() {
        this.isLoading = true;
        this.errorMessage = '';

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

        this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, keyword).subscribe({
            next: data => {
                this.processResult()(data);
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Failed to search products. Please try again.';
                this.products = [];
                this.isLoading = false;
            },
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

        this.productService
            .getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
            .subscribe({
                next: data => {
                    this.processResult()(data);
                    this.isLoading = false;
                },
                error: () => {
                    this.errorMessage = 'Failed to load products. Please try again.';
                    this.products = [];
                    this.isLoading = false;
                },
            });
    }

    updatePageSize(pageSize: string) {
        this.thePageSize = +pageSize;
        this.thePageNumber = 1;
        this.listProducts();
    }

    processResult() {
        return (data: GetResponseProduct) => {
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
        };
    }

    addToCart(product: Product) {
        const cartItem = new CartItem(product);

        this.cartService.addToCart(cartItem);
    }

    onPageChange(event: PaginatorEvent) {
        const first = event.first || 0;
        const rows = event.rows || this.thePageSize;

        this.thePageNumber = Math.floor(first / rows) + 1;
        this.thePageSize = rows;
        this.listProducts();
    }
}
