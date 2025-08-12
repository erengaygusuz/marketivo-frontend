import { OrderHistory } from '../models/order-history';

export interface GetResponseOrderHistory {
    _embedded: {
        orders: OrderHistory[];
    };
}
