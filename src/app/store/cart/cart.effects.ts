import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, tap, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { CartItem } from '../../common/models/cart-item';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  // Load cart from localStorage on app initialization
  loadCart$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() => {
        try {
          const cartData = localStorage.getItem('cartItems');
          const cartItems: CartItem[] = cartData ? JSON.parse(cartData) : [];
          return of(CartActions.loadCartSuccess({ cartItems }));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          return of(CartActions.loadCartFailure({ 
            error: 'Failed to load cart from localStorage' 
          }));
        }
      })
    )
  );

  // Persist cart to localStorage after any cart modification
  persistCart$ = createEffect(() => 
    this.actions$.pipe(
      ofType(
        CartActions.addToCart,
        CartActions.updateCartItemQuantity,
        CartActions.removeFromCart,
        CartActions.clearCart,
        CartActions.persistCart
      ),
      withLatestFrom(this.store.select(selectCartItems)),
      tap(([action, cartItems]) => {
        try {
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
          console.error('Error persisting cart to localStorage:', error);
        }
      })
    ),
    { dispatch: false }
  );
}
