import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Subject } from 'rxjs';
import { OrderHistory } from '../../common/models/order-history';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
    selector: 'app-order-history-component',
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.css',
    imports: [CommonModule, TableModule, MessageModule, ButtonModule, TranslateModule],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    orderHistoryList: OrderHistory[] = [];
    isLoading: boolean = true;
    errorMessage: string = '';

    constructor(
        private orderHistoryService: OrderHistoryService,
        private translate: TranslateService
    ) {}

    ngOnInit() {
        this.handleOrderHistory();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleOrderHistory() {
        this.isLoading = true;
        this.errorMessage = '';

        // Get user email from sessionStorage
        const userEmailFromStorage = sessionStorage.getItem('userEmail');
        const userEmail = userEmailFromStorage ? JSON.parse(userEmailFromStorage) : null;

        if (!userEmail) {
            this.errorMessage = this.translate.instant('OrderHistory.Errors.NoUserEmail');
            this.isLoading = false;

            return;
        }

        this.orderHistoryService.getOrderHistory(userEmail).subscribe({
            next: data => {
                // Check if response has the expected structure
                if (data && data._embedded && data._embedded.orders) {
                    this.orderHistoryList = data._embedded.orders;
                } else {
                    this.orderHistoryList = [];
                }
                this.isLoading = false;
            },
            error: error => {
                this.errorMessage = this.translate.instant('OrderHistory.Errors.LoadFailed');
                this.orderHistoryList = [];
                this.isLoading = false;

                if (error.status === 401) {
                    this.errorMessage = this.translate.instant('OrderHistory.Errors.AuthenticationFailed');
                } else if (error.status === 403) {
                    this.errorMessage = this.translate.instant('OrderHistory.Errors.AccessDenied');
                } else if (error.status === 404) {
                    this.errorMessage = this.translate.instant('OrderHistory.Errors.ServiceNotFound');
                }
            },
        });
    }

    // Method to refresh order history
    refreshOrders() {
        this.handleOrderHistory();
    }
}
