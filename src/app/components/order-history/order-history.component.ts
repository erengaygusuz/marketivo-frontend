import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history.service';
import { OrderHistory } from '../../common/models/order-history';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

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
    private orderHistoryService: OrderHistoryService
  ) {
    
  }

  ngOnInit() {
    console.log('OrderHistoryComponent initialized');
    
    this.handleOrderHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleOrderHistory() {
    console.log('Fetching order history...');
    this.isLoading = true;
    this.errorMessage = '';
    
    // Get user email from sessionStorage
    const userEmailFromStorage = sessionStorage.getItem('userEmail');
    const userEmail = userEmailFromStorage ? JSON.parse(userEmailFromStorage) : null;
    
    console.log('Retrieved email from sessionStorage:', userEmail);
    
    if (!userEmail) {
      console.error('No user email found in sessionStorage');
      this.errorMessage = 'No user email found. Please log in again.';
      this.isLoading = false;
      return;
    }

    this.orderHistoryService.getOrderHistory(userEmail).subscribe({
      next: (data) => {
        console.log('Order history response:', data);
        
        // Check if response has the expected structure
        if (data && data._embedded && data._embedded.orders) {
          this.orderHistoryList = data._embedded.orders;
          console.log('Order history list loaded:', this.orderHistoryList.length, 'orders');
        } else {
          console.log('No orders found in response or unexpected structure');
          this.orderHistoryList = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching order history:', error);
        this.errorMessage = 'Failed to load order history. Please try again.';
        this.orderHistoryList = [];
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. You do not have permission to view orders.';
        } else if (error.status === 404) {
          this.errorMessage = 'Order service not found.';
        }
      }
    });
  }

  // Method to refresh order history
  refreshOrders() {
    console.log('Refreshing order history...');
    this.handleOrderHistory();
  }
}
