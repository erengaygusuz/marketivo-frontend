import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CartFacade } from '../../facades/cart.facade';
import { LanguageFacade } from '../../facades/language.facade';
import { ProductFacade } from '../../facades/product.facade';
import { createCartItem } from '../../models/cart-item';
import { Product } from '../../models/product';

@Component({
    selector: 'app-product-details',
    templateUrl: './app-product-details.component.html',
    styleUrls: ['./app-product-details.component.scss'],
    imports: [CommonModule, ButtonModule, RouterModule, TranslateModule],
})
export class AppProductDetailsComponent implements OnInit, OnDestroy {
    product$: Observable<Product | null>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
    language$: Observable<string>;

    private destroy$ = new Subject<void>();

    constructor(
        private productFacade: ProductFacade,
        private languageFacade: LanguageFacade,
        private cartFacade: CartFacade,
        private route: ActivatedRoute
    ) {
        this.product$ = this.productFacade.currentProduct$;
        this.loading$ = this.productFacade.currentProductLoading$;
        this.error$ = this.productFacade.currentProductErrorMessage$;
        this.language$ = this.languageFacade.getCurrentLanguage();
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.handleProductDetails();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.productFacade.clearCurrentProduct();
    }

    handleProductDetails() {
        const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

        this.language$.pipe(takeUntil(this.destroy$)).subscribe(language => {
            this.productFacade.loadProductDetails(theProductId, language);
        });
    }

    addToCart(product: Product) {
        this.language$.pipe(take(1)).subscribe((language: string) => {
            const theCartItem = createCartItem(product, language);

            this.cartFacade.addToCart(theCartItem);
        });
    }
}
