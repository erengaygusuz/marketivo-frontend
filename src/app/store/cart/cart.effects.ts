import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { CartItem } from '../../common/models/cart-item';
import { ProductService } from '../../services/product.service';
import * as LanguageActions from '../language/language.actions';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';

@Injectable()
export class CartEffects {
    private actions$ = inject(Actions);
    private store = inject(Store);
    private productService = inject(ProductService);

    // Load cart from localStorage on app initialization
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

    // Persist cart to localStorage after any cart modification
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
                    } catch {
                        // Silently handle localStorage errors
                    }
                })
            ),
        { dispatch: false }
    );

    // Listen to language changes and update cart items language
    updateCartItemsOnLanguageChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LanguageActions.setLanguage, LanguageActions.languageLoaded),
            withLatestFrom(this.store.select(selectCartItems)),
            switchMap(([action, cartItems]) => {
                if (cartItems.length === 0) {
                    return of(); // No cart items to update
                }

                const language = action.language;

                // Check if any cart items are missing names for this language
                const itemsMissingNames = cartItems.filter(
                    item => !item.localizedNames || !item.localizedNames[language]
                );

                if (itemsMissingNames.length > 0) {
                    // Fetch missing names first, then update language
                    return of(CartActions.fetchMissingProductNames({ language }));
                } else {
                    // Just update the language
                    return of(CartActions.updateCartItemsLanguage({ language }));
                }
            })
        )
    );

    // Fetch missing product names for a language
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

                // Fetch all missing product names
                const productRequests = itemsMissingNames.map(item =>
                    this.productService.getProduct(parseInt(item.id, 10), language).pipe(
                        map(product => ({ id: item.id, name: product.name, language })),
                        catchError(() => of({ id: item.id, name: item.name, language })) // fallback to current name
                    )
                );

                return forkJoin(productRequests).pipe(
                    switchMap(productData => {
                        // Dispatch multiple add localized name actions
                        const addNameActions = productData.map(({ id, name, language: lang }) =>
                            CartActions.addLocalizedNameToCartItem({ cartItemId: id, language: lang, name })
                        );

                        // Return the first action, others will be dispatched via mergeMap
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
