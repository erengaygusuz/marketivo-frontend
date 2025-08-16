import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { createCartItem } from '../../common/models/cart-item';
import { Product } from '../../common/models/product';
import { AppState } from '../../store/app.state';
import * as CartActions from '../../store/cart/cart.actions';
import { selectCurrentLanguage } from '../../store/language/language.selectors';
import * as ProductActions from '../../store/product/product.actions';
import {
    selectCurrentProduct,
    selectProductDetailsError,
    selectProductDetailsLoading,
} from '../../store/product/product.selectors';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css'],
    imports: [CommonModule, ButtonModule, RouterModule, TranslateModule],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    product$: Observable<Product | null>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
    language$: Observable<string>;

    private destroy$ = new Subject<void>();

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {
        this.product$ = this.store.select(selectCurrentProduct);
        this.loading$ = this.store.select(selectProductDetailsLoading);
        this.error$ = this.store.select(selectProductDetailsError);
        this.language$ = this.store.select(selectCurrentLanguage);
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.handleProductDetails();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.store.dispatch(ProductActions.clearCurrentProduct());
    }

    handleProductDetails() {
        const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

        this.language$.pipe(takeUntil(this.destroy$)).subscribe(language => {
            this.store.dispatch(ProductActions.loadProductDetails({ productId: theProductId, language }));
        });
    }

    addToCart(product: Product) {
        this.language$.pipe(take(1)).subscribe((language: string) => {
            const theCartItem = createCartItem(product, language);

            this.store.dispatch(CartActions.addToCart({ cartItem: theCartItem }));
        });
    }
}
