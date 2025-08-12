import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state?.cartItems || []
);

export const selectCartTotalPrice = createSelector(
  selectCartState,
  (state: CartState) => state?.totalPrice || 0
);

export const selectCartTotalQuantity = createSelector(
  selectCartState,
  (state: CartState) => state?.totalQuantity || 0
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state: CartState) => state?.loading || false
);

export const selectCartError = createSelector(
  selectCartState,
  (state: CartState) => state?.error || null
);

export const selectCartItemsCount = createSelector(
  selectCartItems,
  (cartItems) => cartItems.length
);

export const selectCartItemById = (id: string) => createSelector(
  selectCartItems,
  (cartItems) => cartItems.find(item => item.id === id)
);
