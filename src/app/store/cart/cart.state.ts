import { CartItem } from '../../common/models/cart-item';

export interface CartState {
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  cartItems: [],
  totalPrice: 0,
  totalQuantity: 0,
  loading: false,
  error: null
};
