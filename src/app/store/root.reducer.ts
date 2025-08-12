import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { cartReducer } from './cart/cart.reducer';
import { languageReducer } from './language/language.reducer';

export const rootReducer: ActionReducerMap<AppState> = {
  cart: cartReducer,
  language: languageReducer
};
