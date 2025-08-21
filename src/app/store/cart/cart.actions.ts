import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models/cart-item';

export const loadCart = createAction('[Cart] Load Cart');
export const loadCartSuccess = createAction('[Cart] Load Cart Success', props<{ cartItems: CartItem[] }>());
export const loadCartFailure = createAction('[Cart] Load Cart Failure', props<{ error: string }>());

export const addToCart = createAction('[Cart] Add To Cart', props<{ cartItem: CartItem }>());
export const addToCartSuccess = createAction('[Cart] Add To Cart Success');

export const updateCartItemQuantity = createAction(
    '[Cart] Update Cart Item Quantity',
    props<{ cartItemId: string; quantity: number }>()
);

export const removeFromCart = createAction('[Cart] Remove From Cart', props<{ cartItemId: string }>());

export const clearCart = createAction('[Cart] Clear Cart');

export const computeCartTotals = createAction('[Cart] Compute Cart Totals');

export const persistCart = createAction('[Cart] Persist Cart');

export const updateCartItemsLanguage = createAction('[Cart] Update Cart Items Language', props<{ language: string }>());

export const addLocalizedNameToCartItem = createAction(
    '[Cart] Add Localized Name To Cart Item',
    props<{ cartItemId: string; language: string; name: string }>()
);

export const fetchMissingProductNames = createAction(
    '[Cart] Fetch Missing Product Names',
    props<{ language: string }>()
);

export const fetchMissingProductNamesSuccess = createAction(
    '[Cart] Fetch Missing Product Names Success',
    props<{ productNames: { id: string; name: string }[] }>()
);

export const fetchMissingProductNamesFailure = createAction(
    '[Cart] Fetch Missing Product Names Failure',
    props<{ error: string }>()
);
