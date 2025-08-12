import { CartState } from './cart/cart.state';
import { LanguageState } from './language/language.state';
import { AuthState } from './auth/auth.state';

export interface AppState {
  cart: CartState;
  language: LanguageState;
  auth: AuthState;
}
