import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderHistoryState } from './order-history.state';

export const selectOrderHistoryState = createFeatureSelector<OrderHistoryState>('orderHistory');

export const selectOrderHistory = createSelector(selectOrderHistoryState, (state: OrderHistoryState) => state.orders);

export const selectOrderHistoryLoading = createSelector(
    selectOrderHistoryState,
    (state: OrderHistoryState) => state.loading
);

export const selectOrderHistoryError = createSelector(
    selectOrderHistoryState,
    (state: OrderHistoryState) => state.error
);

export const selectOrderHistoryCount = createSelector(selectOrderHistory, orders => orders.length);

export const selectHasOrderHistory = createSelector(selectOrderHistory, orders => orders.length > 0);
