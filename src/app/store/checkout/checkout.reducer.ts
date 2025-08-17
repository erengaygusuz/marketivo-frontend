import { createReducer, on } from '@ngrx/store';
import * as CheckoutActions from './checkout.actions';
import { initialCheckoutState } from './checkout.state';

export const checkoutReducer = createReducer(
    initialCheckoutState,

    // Load countries
    on(CheckoutActions.loadCountries, state => ({
        ...state,
        loading: true,
    })),

    on(CheckoutActions.loadCountriesSuccess, (state, { countries }) => ({
        ...state,
        countries,
        loading: false,
    })),

    on(CheckoutActions.loadCountriesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Load states
    on(CheckoutActions.loadStates, state => ({
        ...state,
        loading: true,
    })),

    on(CheckoutActions.loadStatesSuccess, (state, { states, addressType }) => ({
        ...state,
        ...(addressType === 'shipping' ? { shippingAddressStates: states } : { billingAddressStates: states }),
        loading: false,
    })),

    on(CheckoutActions.loadStatesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Load credit card months
    on(CheckoutActions.loadCreditCardMonthsSuccess, (state, { months }) => ({
        ...state,
        creditCardMonths: months,
    })),

    // Payment intent
    on(CheckoutActions.createPaymentIntent, state => ({
        ...state,
        isProcessingPayment: true,
        paymentError: null,
    })),

    on(CheckoutActions.createPaymentIntentSuccess, (state, { clientSecret }) => ({
        ...state,
        isProcessingPayment: false,
        paymentError: null,
        clientSecret,
    })),

    on(CheckoutActions.createPaymentIntentFailure, (state, { error }) => ({
        ...state,
        isProcessingPayment: false,
        paymentError: error,
    })),

    // Place order
    on(CheckoutActions.placeOrder, state => ({
        ...state,
        isProcessingPayment: true,
        paymentError: null,
    })),

    on(CheckoutActions.placeOrderSuccess, state => ({
        ...state,
        isProcessingPayment: false,
        paymentError: null,
    })),

    on(CheckoutActions.placeOrderFailure, (state, { error }) => ({
        ...state,
        isProcessingPayment: false,
        paymentError: error,
    })),

    // Reset checkout
    on(CheckoutActions.resetCheckout, () => ({
        ...initialCheckoutState,
    })),

    // Set payment processing state
    on(CheckoutActions.setPaymentProcessing, (state, { isProcessing }) => ({
        ...state,
        isProcessingPayment: isProcessing,
    })),

    // Clear errors
    on(CheckoutActions.clearCheckoutError, state => ({
        ...state,
        error: null,
    })),

    on(CheckoutActions.clearPaymentError, state => ({
        ...state,
        paymentError: null,
    })),

    // Stripe actions
    on(CheckoutActions.initializeStripe, state => ({
        ...state,
        loading: true,
        stripeError: null,
    })),

    on(CheckoutActions.initializeStripeSuccess, state => ({
        ...state,
        loading: false,
        isStripeInitialized: true,
        stripeError: null,
    })),

    on(CheckoutActions.initializeStripeFailure, (state, { error }) => ({
        ...state,
        loading: false,
        isStripeInitialized: false,
        stripeError: error,
    })),

    on(CheckoutActions.setStripeError, (state, { error }) => ({
        ...state,
        stripeError: error,
    })),

    on(CheckoutActions.clearStripeError, state => ({
        ...state,
        stripeError: null,
    }))
);
