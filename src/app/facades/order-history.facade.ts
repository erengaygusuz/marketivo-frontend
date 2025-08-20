import { AppState } from '@/store/app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrderHistory } from '../models/order-history';
import * as OrderHistoryActions from '../store/order-history/order-history.actions';
import {
    selectOrderHistory,
    selectOrderHistoryError,
    selectOrderHistoryLoading,
} from '../store/order-history/order-history.selectors';

@Injectable({
    providedIn: 'root',
})
export class OrderHistoryFacade {
    constructor(private store: Store<AppState>) {}

    get orderHistoryList$(): Observable<OrderHistory[]> {
        return this.store.select(selectOrderHistory);
    }

    get isLoading$(): Observable<boolean> {
        return this.store.select(selectOrderHistoryLoading);
    }

    get errorMessage$(): Observable<string | null> {
        return this.store.select(selectOrderHistoryError);
    }

    loadOrderHistory(email: string): void {
        this.store.dispatch(OrderHistoryActions.loadOrderHistory({ email }));
    }

    clearOrderHistoryError(): void {
        this.store.dispatch(OrderHistoryActions.clearOrderHistoryError());
    }

    loadOrderHistoryFailure(error: string): void {
        this.store.dispatch(OrderHistoryActions.loadOrderHistoryFailure({ error }));
    }
}
