import { createAction, props } from '@ngrx/store';
import { GetResponseOrderHistory } from '../../common/interfaces/GetResponseOrderHistory';

// Load order history
export const loadOrderHistory = createAction('[Order History] Load Order History', props<{ email: string }>());

export const loadOrderHistorySuccess = createAction(
    '[Order History] Load Order History Success',
    props<{ response: GetResponseOrderHistory }>()
);

export const loadOrderHistoryFailure = createAction(
    '[Order History] Load Order History Failure',
    props<{ error: string }>()
);

// Clear order history
export const clearOrderHistory = createAction('[Order History] Clear Order History');

// Set loading state
export const setOrderHistoryLoading = createAction('[Order History] Set Loading', props<{ loading: boolean }>());

// Clear errors
export const clearOrderHistoryError = createAction('[Order History] Clear Error');
