import { OrderHistory } from './order-history';

export interface GetResponseOrderHistory {
    _embedded: {
        orders: OrderHistory[];
    };
}
