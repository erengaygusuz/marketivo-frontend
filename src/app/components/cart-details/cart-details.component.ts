import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/models/cart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css',
  imports: [CommonModule]
})
export class CartDetailsComponent {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    this.cartService.computeCartTotals();
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }

  remove(cartItem: CartItem) {
    this.cartService.remove(cartItem);
  }
}
