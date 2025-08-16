import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './auth/auth.reducer';
import { cartReducer } from './cart/cart.reducer';
import { languageReducer } from './language/language.reducer';
import { orderHistoryReducer } from './order-history/order-history.reducer';
import { productReducer } from './product/product.reducer';

export const rootReducer: ActionReducerMap<AppState> = {
    cart: cartReducer,
    language: languageReducer,
    auth: authReducer,
    product: productReducer,
    orderHistory: orderHistoryReducer,
};
