import { AuthState } from './auth/auth.state';
import { CartState } from './cart/cart.state';
import { LanguageState } from './language/language.state';
import { OrderHistoryState } from './order-history/order-history.state';
import { ProductState } from './product/product.state';

export interface AppState {
    cart: CartState;
    language: LanguageState;
    auth: AuthState;
    product: ProductState;
    orderHistory: OrderHistoryState;
}
