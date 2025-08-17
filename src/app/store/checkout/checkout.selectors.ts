import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CheckoutState } from './checkout.state';

export const selectCheckoutState = createFeatureSelector<CheckoutState>('checkout');

// Form data selectors
export const selectCountries = createSelector(selectCheckoutState, (state: CheckoutState) => state.countries);

export const selectShippingAddressStates = createSelector(
    selectCheckoutState,
    (state: CheckoutState) => state.shippingAddressStates
);

export const selectBillingAddressStates = createSelector(
    selectCheckoutState,
    (state: CheckoutState) => state.billingAddressStates
);

export const selectCreditCardMonths = createSelector(
    selectCheckoutState,
    (state: CheckoutState) => state.creditCardMonths
);

export const selectCreditCardYears = createSelector(
    selectCheckoutState,
    (state: CheckoutState) => state.creditCardYears
);

// Loading and error selectors
export const selectCheckoutLoading = createSelector(selectCheckoutState, (state: CheckoutState) => state.loading);

export const selectCheckoutError = createSelector(selectCheckoutState, (state: CheckoutState) => state.error);

export const selectIsProcessingPayment = createSelector(
    selectCheckoutState,
    (state: CheckoutState) => state.isProcessingPayment
);

export const selectPaymentError = createSelector(selectCheckoutState, (state: CheckoutState) => state.paymentError);

// Payment intent selector
export const selectClientSecret = createSelector(selectCheckoutState, (state: CheckoutState) => state.clientSecret);

// Stripe selectors
export const selectIsStripeInitialized = createSelector(
    selectCheckoutState,
    (state: CheckoutState) => state.isStripeInitialized
);

export const selectStripeError = createSelector(selectCheckoutState, (state: CheckoutState) => state.stripeError);
