import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Observable, Subject } from 'rxjs';
import { OrderHistory } from '../../common/models/order-history';
import { AppState } from '../../store/app.state';
import * as OrderHistoryActions from '../../store/order-history/order-history.actions';
import {
    selectOrderHistory,
    selectOrderHistoryError,
    selectOrderHistoryLoading,
} from '../../store/order-history/order-history.selectors';

@Component({
    selector: 'app-order-history-component',
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.css',
    imports: [CommonModule, TableModule, MessageModule, ButtonModule, TranslateModule],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    orderHistoryList$: Observable<OrderHistory[]>;
    isLoading$: Observable<boolean>;
    errorMessage$: Observable<string | null>;

    constructor(
        private store: Store<AppState>,
        private translate: TranslateService
    ) {
        this.orderHistoryList$ = this.store.select(selectOrderHistory);
        this.isLoading$ = this.store.select(selectOrderHistoryLoading);
        this.errorMessage$ = this.store.select(selectOrderHistoryError);
    }

    ngOnInit() {
        this.handleOrderHistory();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleOrderHistory() {
        // Clear any previous errors
        this.store.dispatch(OrderHistoryActions.clearOrderHistoryError());

        // Get user email from sessionStorage
        const userEmailFromStorage = sessionStorage.getItem('userEmail');
        const userEmail: string | null = userEmailFromStorage ? (JSON.parse(userEmailFromStorage) as string) : null;

        if (!userEmail) {
            const errorMessage = this.translate.instant('OrderHistory.Errors.NoUserEmail');

            this.store.dispatch(OrderHistoryActions.loadOrderHistoryFailure({ error: errorMessage }));

            return;
        }

        // Dispatch action to load order history
        this.store.dispatch(OrderHistoryActions.loadOrderHistory({ email: userEmail }));
    }

    // Method to refresh order history
    refreshOrders() {
        this.handleOrderHistory();
    }
}
