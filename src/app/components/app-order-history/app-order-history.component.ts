import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { OrderHistoryFacade } from '../../facades/order-history.facade';
import { OrderHistory } from '../../models/order-history';

@Component({
    selector: 'app-order-history-component',
    templateUrl: './app-order-history.component.html',
    styleUrl: './app-order-history.component.css',
    imports: [CommonModule, TableModule, MessageModule, ButtonModule, TranslateModule],
})
export class AppOrderHistoryComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    orderHistoryList: OrderHistory[] = [];
    isLoading: boolean = false;
    errorMessage: string | null = null;

    constructor(
        private translate: TranslateService,
        private orderHistoryFacade: OrderHistoryFacade
    ) {
        this.orderHistoryFacade.orderHistoryList$.pipe(takeUntil(this.destroy$)).subscribe(orderHistory => {
            this.orderHistoryList = orderHistory;
        });

        this.orderHistoryFacade.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
            this.isLoading = loading;
        });

        this.orderHistoryFacade.errorMessage$.pipe(takeUntil(this.destroy$)).subscribe(error => {
            this.errorMessage = error;
        });

        this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.handleOrderHistory();
        });
    }

    ngOnInit() {
        this.handleOrderHistory();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleOrderHistory() {
        this.orderHistoryFacade.clearOrderHistoryError();

        const userEmailFromStorage = sessionStorage.getItem('userEmail');
        const userEmail: string | null = userEmailFromStorage ? (JSON.parse(userEmailFromStorage) as string) : null;

        if (!userEmail) {
            const errorMessage = this.translate.instant('OrderHistory.Errors.NoUserEmail');

            this.orderHistoryFacade.loadOrderHistoryFailure(errorMessage);

            return;
        }

        this.orderHistoryFacade.loadOrderHistory(userEmail);
    }

    // Method to refresh order history
    refreshOrders() {
        this.handleOrderHistory();
    }
}
