import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetResponseOrderHistory } from '../common/interfaces/GetResponseOrderHistory';

@Injectable({
    providedIn: 'root',
})
export class OrderHistoryService {
    private orderUrl = `${environment.apiBaseUrl}/orders`;

    constructor(private httpClient: HttpClient) {}

    getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {
        const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail.replace(/"/g, '')}`;

        return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
    }
}
