import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/models/cart-item';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-cart-details',
    templateUrl: './cart-details.component.html',
    imports: [CommonModule, TableModule, ButtonModule, RouterModule, MessageModule, TranslateModule],
})
export class CartDetailsComponent implements OnInit, OnDestroy {
    cartItems: CartItem[] = [];
    totalPrice: number = 0;
    totalQuantity: number = 0;
    private destroy$ = new Subject<void>();

    constructor(private cartService: CartService) {}

    ngOnInit(): void {
        this.listCartDetails();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    listCartDetails() {
        this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(cartItems => (this.cartItems = cartItems));

        this.cartService.totalPrice$.pipe(takeUntil(this.destroy$)).subscribe(data => (this.totalPrice = data));

        this.cartService.totalQuantity$.pipe(takeUntil(this.destroy$)).subscribe(data => (this.totalQuantity = data));
    }

    incrementQuantity(cartItem: CartItem) {
        this.cartService.incrementQuantity(cartItem);
    }

    decrementQuantity(cartItem: CartItem) {
        this.cartService.decrementQuantity(cartItem);
    }

    remove(cartItem: CartItem) {
        this.cartService.removeFromCart(cartItem.id);
    }
}
