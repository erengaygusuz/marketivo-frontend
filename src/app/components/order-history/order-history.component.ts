import { Component } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-order-history-component',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const theEmail = this.storage.getItem('userEmail');

    this.orderHistoryService.getOrderHistory(theEmail!).subscribe(
        (data) => {
          this.orderHistoryList = data._embedded.orders;
        }
      );
  }
}
