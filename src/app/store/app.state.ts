import { CartState } from './cart/cart.state';
import { LanguageState } from './language/language.state';

export interface AppState {
  cart: CartState;
  language: LanguageState;
}
