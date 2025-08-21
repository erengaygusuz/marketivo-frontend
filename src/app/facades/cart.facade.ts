import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { AppState } from '../store/app.state';
import * as CartActions from '../store/cart/cart.actions';
import * as CartSelectors from '../store/cart/cart.selectors';

@Injectable({
    providedIn: 'root',
})
export class CartFacade {
    constructor(private store: Store<AppState>) {}

    get cartItems$(): Observable<CartItem[]> {
        return this.store.select(CartSelectors.selectCartItems);
    }

    get totalPrice$(): Observable<number> {
        return this.store.select(CartSelectors.selectCartTotalPrice);
    }

    get totalQuantity$(): Observable<number> {
        return this.store.select(CartSelectors.selectCartTotalQuantity);
    }

    getCurrentCartData(): Observable<{ cartItems: CartItem[]; totalPrice: number; totalQuantity: number }> {
        return this.store.select(state => ({
            cartItems: CartSelectors.selectCartItems(state),
            totalPrice: CartSelectors.selectCartTotalPrice(state),
            totalQuantity: CartSelectors.selectCartTotalQuantity(state),
        }));
    }

    addToCart(cartItem: CartItem): void {
        this.store.dispatch(CartActions.addToCart({ cartItem }));
    }
}
