import { Component } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history.service';
import { OrderHistory } from '../../common/models/order-history';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history-component',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
  imports: [CommonModule],
})
export class OrderHistoryComponent {
  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const theEmail = this.storage.getItem('userEmail');

    this.orderHistoryService.getOrderHistory(theEmail!).subscribe((data) => {
      this.orderHistoryList = data._embedded.orders;
    });
  }
}
