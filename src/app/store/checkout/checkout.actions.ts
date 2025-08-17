import { createAction, props } from '@ngrx/store';
import { Country } from '../../common/models/country';
import { PaymentInfo } from '../../common/models/payment-info';
import { Purchase } from '../../common/models/purchase';
import { State } from '../../common/models/state';

// Load countries
export const loadCountries = createAction('[Checkout] Load Countries');
export const loadCountriesSuccess = createAction(
    '[Checkout] Load Countries Success',
    props<{ countries: Country[] }>()
);
export const loadCountriesFailure = createAction('[Checkout] Load Countries Failure', props<{ error: string }>());

// Load states
export const loadStates = createAction(
    '[Checkout] Load States',
    props<{ countryCode: string; addressType: 'shipping' | 'billing' }>()
);
export const loadStatesSuccess = createAction(
    '[Checkout] Load States Success',
    props<{ states: State[]; addressType: 'shipping' | 'billing' }>()
);
export const loadStatesFailure = createAction('[Checkout] Load States Failure', props<{ error: string }>());

// Load credit card months
export const loadCreditCardMonths = createAction('[Checkout] Load Credit Card Months', props<{ startMonth: number }>());
export const loadCreditCardMonthsSuccess = createAction(
    '[Checkout] Load Credit Card Months Success',
    props<{ months: number[] }>()
);

// Create payment intent
export const createPaymentIntent = createAction(
    '[Checkout] Create Payment Intent',
    props<{ paymentInfo: PaymentInfo }>()
);
export const createPaymentIntentSuccess = createAction(
    '[Checkout] Create Payment Intent Success',
    props<{ clientSecret: string }>()
);
export const createPaymentIntentFailure = createAction(
    '[Checkout] Create Payment Intent Failure',
    props<{ error: string }>()
);

// Place order
export const placeOrder = createAction('[Checkout] Place Order', props<{ purchase: Purchase }>());
export const placeOrderSuccess = createAction(
    '[Checkout] Place Order Success',
    props<{ orderTrackingNumber: string }>()
);
export const placeOrderFailure = createAction('[Checkout] Place Order Failure', props<{ error: string }>());

// Reset checkout
export const resetCheckout = createAction('[Checkout] Reset Checkout');

// Set payment processing state
export const setPaymentProcessing = createAction(
    '[Checkout] Set Payment Processing',
    props<{ isProcessing: boolean }>()
);

// Clear errors
export const clearCheckoutError = createAction('[Checkout] Clear Error');
export const clearPaymentError = createAction('[Checkout] Clear Payment Error');

// Stripe actions
export const initializeStripe = createAction('[Checkout] Initialize Stripe');
export const initializeStripeSuccess = createAction('[Checkout] Initialize Stripe Success');
export const initializeStripeFailure = createAction('[Checkout] Initialize Stripe Failure', props<{ error: string }>());

export const setStripeError = createAction('[Checkout] Set Stripe Error', props<{ error: string }>());
export const clearStripeError = createAction('[Checkout] Clear Stripe Error');
