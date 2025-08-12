import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-cart-status',
    templateUrl: './cart-status.component.html',
    styleUrls: ['./cart-status.component.css'],
    imports: [CommonModule, OverlayBadgeModule, TranslateModule],
})
export class CartStatusComponent implements OnInit, OnDestroy {
    totalPrice: number = 0.0;
    totalQuantity: number = 0;
    private destroy$ = new Subject<void>();

    constructor(private cartService: CartService) {}

    ngOnInit(): void {
        this.updateCartStatus();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateCartStatus(): void {
        this.cartService.totalPrice$.pipe(takeUntil(this.destroy$)).subscribe(data => (this.totalPrice = data));

        this.cartService.totalQuantity$.pipe(takeUntil(this.destroy$)).subscribe(data => (this.totalQuantity = data));
    }
}
