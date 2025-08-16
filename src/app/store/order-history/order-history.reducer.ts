import { createReducer, on } from '@ngrx/store';
import * as OrderHistoryActions from './order-history.actions';
import { initialOrderHistoryState } from './order-history.state';

export const orderHistoryReducer = createReducer(
    initialOrderHistoryState,

    // Load order history
    on(OrderHistoryActions.loadOrderHistory, state => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(OrderHistoryActions.loadOrderHistorySuccess, (state, { response }) => ({
        ...state,
        orders: response._embedded?.orders || [],
        loading: false,
        error: null,
    })),

    on(OrderHistoryActions.loadOrderHistoryFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Clear order history
    on(OrderHistoryActions.clearOrderHistory, state => ({
        ...state,
        orders: [],
        error: null,
    })),

    // Set loading state
    on(OrderHistoryActions.setOrderHistoryLoading, (state, { loading }) => ({
        ...state,
        loading,
    })),

    // Clear errors
    on(OrderHistoryActions.clearOrderHistoryError, state => ({
        ...state,
        error: null,
    }))
);
