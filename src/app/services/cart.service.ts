import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../common/models/cart-item';
import { AppState } from '../store/app.state';
import * as CartActions from '../store/cart/cart.actions';
import * as CartSelectors from '../store/cart/cart.selectors';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    // Private store reference
    private store: Store<AppState>;

    constructor(store: Store<AppState>) {
        this.store = store;
    }

    // Getter methods for observables to ensure they're created when accessed
    get cartItems$(): Observable<CartItem[]> {
        return this.store.select(CartSelectors.selectCartItems);
    }

    get totalPrice$(): Observable<number> {
        return this.store.select(CartSelectors.selectCartTotalPrice);
    }

    get totalQuantity$(): Observable<number> {
        return this.store.select(CartSelectors.selectCartTotalQuantity);
    }

    get loading$(): Observable<boolean> {
        return this.store.select(CartSelectors.selectCartLoading);
    }

    get error$(): Observable<string | null> {
        return this.store.select(CartSelectors.selectCartError);
    }

    // Initialize cart (load from localStorage)
    initializeCart(): void {
        this.store.dispatch(CartActions.loadCart());
    }

    // Add item to cart
    addToCart(cartItem: CartItem): void {
        this.store.dispatch(CartActions.addToCart({ cartItem }));
    }

    // Update cart item quantity
    updateCartItemQuantity(cartItemId: string, quantity: number): void {
        this.store.dispatch(CartActions.updateCartItemQuantity({ cartItemId, quantity }));
    }

    // Increment quantity
    incrementQuantity(cartItem: CartItem): void {
        this.updateCartItemQuantity(cartItem.id, cartItem.quantity + 1);
    }

    // Decrement quantity
    decrementQuantity(cartItem: CartItem): void {
        const newQuantity = cartItem.quantity - 1;

        if (newQuantity <= 0) {
            this.removeFromCart(cartItem.id);
        } else {
            this.updateCartItemQuantity(cartItem.id, newQuantity);
        }
    }

    // Remove item from cart
    removeFromCart(cartItemId: string): void {
        this.store.dispatch(CartActions.removeFromCart({ cartItemId }));
    }

    // Clear entire cart
    clearCart(): void {
        this.store.dispatch(CartActions.clearCart());
    }

    // Compute cart totals (usually called automatically by reducers)
    computeCartTotals(): void {
        this.store.dispatch(CartActions.computeCartTotals());
    }

    // Persist cart to localStorage
    persistCart(): void {
        this.store.dispatch(CartActions.persistCart());
    }

    // Legacy compatibility methods for existing components
    get cartItems(): CartItem[] {
        let items: CartItem[] = [];

        this.cartItems$.subscribe(cartItems => (items = cartItems)).unsubscribe();

        return items;
    }

    get totalPrice(): Observable<number> {
        return this.totalPrice$;
    }

    get totalQuantity(): Observable<number> {
        return this.totalQuantity$;
    }
}
