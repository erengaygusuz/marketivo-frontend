import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { AuthFacade } from '../../facades/auth.facade';
import { LanguageFacade } from '../../facades/language.facade';
import { OrderHistoryFacade } from '../../facades/order-history.facade';
import { OrderHistory } from '../../models/order-history';

@Component({
    selector: 'app-order-history-component',
    templateUrl: './app-order-history.component.html',
    styleUrl: './app-order-history.component.scss',
    imports: [CommonModule, TableModule, MessageModule, ButtonModule, TranslateModule],
})
export class AppOrderHistoryComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    orderHistoryList: OrderHistory[] = [];
    isLoading: boolean = false;
    errorMessage: string | null = null;

    constructor(
        private orderHistoryFacade: OrderHistoryFacade,
        private authFacade: AuthFacade,
        private languageFacade: LanguageFacade
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

        this.languageFacade.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(() => {
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

        this.authFacade.userEmail$.pipe(takeUntil(this.destroy$)).subscribe(userEmail => {
            if (!userEmail) {
                const errorMessage = this.languageFacade.translateInstant('OrderHistory.Errors.NoUserEmail');

                this.orderHistoryFacade.loadOrderHistoryFailure(errorMessage);

                return;
            }

            this.orderHistoryFacade.loadOrderHistory(userEmail);
        });
    }

    refreshOrders() {
        this.handleOrderHistory();
    }
}
