import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Purchase } from '../common/models/purchase';
import { PaymentInfo } from '../common/models/payment-info';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = `${environment.apiBaseUrl}/checkout/purchase`;

  private paymentIntentUrl = `${environment.apiBaseUrl}/checkout/payment-intent`;

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(
      this.paymentIntentUrl,
      paymentInfo
    );
  }
}
