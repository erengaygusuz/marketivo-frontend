import { OrderHistory } from '../../common/models/order-history';

export interface OrderHistoryState {
    orders: OrderHistory[];
    loading: boolean;
    error: string | null;
}

export const initialOrderHistoryState: OrderHistoryState = {
    orders: [],
    loading: false,
    error: null,
};
