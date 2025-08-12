import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../common/models/cart-item';

// Load cart from localStorage
export const loadCart = createAction('[Cart] Load Cart');
export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ cartItems: CartItem[] }>()
);
export const loadCartFailure = createAction(
  '[Cart] Load Cart Failure',
  props<{ error: string }>()
);

// Add to cart
export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ cartItem: CartItem }>()
);
export const addToCartSuccess = createAction('[Cart] Add To Cart Success');

// Update cart item quantity
export const updateCartItemQuantity = createAction(
  '[Cart] Update Cart Item Quantity',
  props<{ cartItemId: string; quantity: number }>()
);

// Remove from cart
export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ cartItemId: string }>()
);

// Clear cart
export const clearCart = createAction('[Cart] Clear Cart');

// Compute cart totals
export const computeCartTotals = createAction('[Cart] Compute Cart Totals');

// Persist cart to localStorage
export const persistCart = createAction('[Cart] Persist Cart');
