import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetResponsePaymentIntent } from '../models/get-response-payment-intent';
import { GetResponsePlaceOrder } from '../models/get-response-place-order';
import { PaymentInfo } from '../models/payment-info';
import { Purchase } from '../models/purchase';

@Injectable({
    providedIn: 'root',
})
export class CheckoutService {
    private purchaseUrl = `${environment.apiBaseUrl}/checkout/purchase`;

    private paymentIntentUrl = `${environment.apiBaseUrl}/checkout/payment-intent`;

    constructor(private httpClient: HttpClient) {}

    placeOrder(purchase: Purchase): Observable<GetResponsePlaceOrder> {
        return this.httpClient.post<GetResponsePlaceOrder>(this.purchaseUrl, purchase);
    }

    createPaymentIntent(paymentInfo: PaymentInfo): Observable<GetResponsePaymentIntent> {
        return this.httpClient.post<GetResponsePaymentIntent>(this.paymentIntentUrl, paymentInfo);
    }
}
