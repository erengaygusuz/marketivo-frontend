import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { cartReducer } from './cart/cart.reducer';
import { languageReducer } from './language/language.reducer';
import { authReducer } from './auth/auth.reducer';

export const rootReducer: ActionReducerMap<AppState> = {
  cart: cartReducer,
  language: languageReducer,
  auth: authReducer
};
