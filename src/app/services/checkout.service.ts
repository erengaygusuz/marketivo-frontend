import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentIntentResponse } from '../common/interfaces/PaymentIntentResponse';
import { PlaceOrderResponse } from '../common/interfaces/PlaceOrderResponse';
import { PaymentInfo } from '../common/models/payment-info';
import { Purchase } from '../common/models/purchase';

@Injectable({
    providedIn: 'root',
})
export class CheckoutService {
    private purchaseUrl = `${environment.apiBaseUrl}/checkout/purchase`;

    private paymentIntentUrl = `${environment.apiBaseUrl}/checkout/payment-intent`;

    constructor(private httpClient: HttpClient) {}

    placeOrder(purchase: Purchase): Observable<PlaceOrderResponse> {
        return this.httpClient.post<PlaceOrderResponse>(this.purchaseUrl, purchase);
    }

    createPaymentIntent(paymentInfo: PaymentInfo): Observable<PaymentIntentResponse> {
        return this.httpClient.post<PaymentIntentResponse>(this.paymentIntentUrl, paymentInfo);
    }
}
