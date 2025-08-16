import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import * as LanguageActions from '../language/language.actions';
import { selectCurrentLanguage } from '../language/language.selectors';
import * as ProductActions from './product.actions';
import { selectCurrentCategoryId, selectPagination, selectSearchKeyword } from './product.selectors';

@Injectable()
export class ProductEffects {
    private actions$ = inject(Actions);
    private store = inject(Store);
    private productService = inject(ProductService);

    loadCategories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.loadCategories),
            switchMap(({ language }) =>
                this.productService.getProductCategories(language).pipe(
                    map(categories => ProductActions.loadCategoriesSuccess({ categories })),
                    catchError(error => of(ProductActions.loadCategoriesFailure({ error: error.message })))
                )
            )
        )
    );

    loadProductsByCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.loadProductsByCategory),
            switchMap(({ categoryId, page, size, language }) =>
                this.productService.getProductListPaginate(page, size, categoryId, language).pipe(
                    map(response => ProductActions.loadProductsByCategorySuccess({ response })),
                    catchError(error => of(ProductActions.loadProductsByCategoryFailure({ error: error.message })))
                )
            )
        )
    );

    searchProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.searchProducts),
            switchMap(({ keyword, page, size, language }) =>
                this.productService.searchProductsPaginate(page, size, keyword, language).pipe(
                    map(response => ProductActions.searchProductsSuccess({ response })),
                    catchError(error => of(ProductActions.searchProductsFailure({ error: error.message })))
                )
            )
        )
    );

    reloadDataOnLanguageChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.reloadDataOnLanguageChange),
            mergeMap(({ language, currentCategoryId, searchKeyword, page = 0, size = 5 }) => {
                const actions = [];

                // Always reload categories
                actions.push(ProductActions.loadCategories({ language }));

                // Reload products based on current state
                if (searchKeyword) {
                    actions.push(ProductActions.searchProducts({ keyword: searchKeyword, page, size, language }));
                } else if (currentCategoryId) {
                    actions.push(
                        ProductActions.loadProductsByCategory({ categoryId: currentCategoryId, page, size, language })
                    );
                }

                return actions;
            })
        )
    );

    // Listen to language changes and trigger reload
    languageChanged$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LanguageActions.setLanguage, LanguageActions.languageLoaded),
            withLatestFrom(
                this.store.select(selectCurrentLanguage),
                this.store.select(selectCurrentCategoryId),
                this.store.select(selectSearchKeyword),
                this.store.select(selectPagination)
            ),
            map(([action, currentLanguage, categoryId, searchKeyword, pagination]) => {
                const language = 'language' in action ? action.language : currentLanguage;
                return ProductActions.reloadDataOnLanguageChange({
                    language,
                    currentCategoryId: categoryId || undefined,
                    searchKeyword: searchKeyword || undefined,
                    page: pagination?.pageNumber ? pagination.pageNumber - 1 : 0,
                    size: pagination?.pageSize || 5,
                });
            })
        )
    );
}
