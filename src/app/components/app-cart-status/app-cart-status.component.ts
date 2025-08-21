import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart-status',
    templateUrl: './app-cart-status.component.html',
    styleUrls: ['./app-cart-status.component.scss'],
    imports: [CommonModule, OverlayBadgeModule, TranslateModule],
})
export class AppCartStatusComponent implements OnInit, OnDestroy {
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
