import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { CartItem } from '../../models/cart-item';
import { ProductService } from '../../services/product.service';
import * as LanguageActions from '../language/language.actions';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';

@Injectable()
export class CartEffects {
    private actions$ = inject(Actions);
    private store = inject(Store);
    private productService = inject(ProductService);

    loadCart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CartActions.loadCart),
            switchMap(() => {
                try {
                    const cartData = localStorage.getItem('cartItems');
                    const cartItems: CartItem[] = cartData ? JSON.parse(cartData) : [];

                    return of(CartActions.loadCartSuccess({ cartItems }));
                } catch {
                    return of(
                        CartActions.loadCartFailure({
                            error: 'Failed to load cart from localStorage',
                        })
                    );
                }
            })
        )
    );

    persistCart$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    CartActions.addToCart,
                    CartActions.updateCartItemQuantity,
                    CartActions.removeFromCart,
                    CartActions.clearCart,
                    CartActions.persistCart
                ),
                withLatestFrom(this.store.select(selectCartItems)),
                tap(([_action, cartItems]) => {
                    try {
                        localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    } catch {}
                })
            ),
        { dispatch: false }
    );

    updateCartItemsOnLanguageChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LanguageActions.setLanguage, LanguageActions.languageLoaded),
            withLatestFrom(this.store.select(selectCartItems)),
            switchMap(([action, cartItems]) => {
                if (cartItems.length === 0) {
                    return of();
                }

                const language = action.language;

                const itemsMissingNames = cartItems.filter(
                    item => !item.localizedNames || !item.localizedNames[language]
                );

                if (itemsMissingNames.length > 0) {
                    return of(CartActions.fetchMissingProductNames({ language }));
                } else {
                    return of(CartActions.updateCartItemsLanguage({ language }));
                }
            })
        )
    );

    fetchMissingProductNames$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CartActions.fetchMissingProductNames),
            withLatestFrom(this.store.select(selectCartItems)),
            switchMap(([{ language }, cartItems]) => {
                const itemsMissingNames = cartItems.filter(
                    item => !item.localizedNames || !item.localizedNames[language]
                );

                if (itemsMissingNames.length === 0) {
                    return of(CartActions.updateCartItemsLanguage({ language }));
                }

                const productRequests = itemsMissingNames.map(item =>
                    this.productService.getProduct(parseInt(item.id, 10), language).pipe(
                        map(product => ({ id: item.id, name: product.name, language })),
                        catchError(() => of({ id: item.id, name: item.name, language })) // fallback to current name
                    )
                );

                return forkJoin(productRequests).pipe(
                    switchMap(productData => {
                        const addNameActions = productData.map(({ id, name, language: lang }) =>
                            CartActions.addLocalizedNameToCartItem({ cartItemId: id, language: lang, name })
                        );

                        return addNameActions.length > 0
                            ? of(...addNameActions, CartActions.updateCartItemsLanguage({ language }))
                            : of(CartActions.updateCartItemsLanguage({ language }));
                    }),
                    catchError(error => of(CartActions.fetchMissingProductNamesFailure({ error: error.message })))
                );
            })
        )
    );
}
