import { Country } from '../../common/models/country';
import { State } from '../../common/models/state';

export interface CheckoutState {
    // Form data
    countries: Country[];
    shippingAddressStates: State[];
    billingAddressStates: State[];
    creditCardMonths: number[];
    creditCardYears: number[];

    // Payment processing
    isProcessingPayment: boolean;
    paymentError: string | null;
    clientSecret: string | null;

    // Stripe state
    isStripeInitialized: boolean;
    stripeError: string | null;

    // Loading states
    loading: boolean;
    error: string | null;
}

export const initialCheckoutState: CheckoutState = {
    countries: [],
    shippingAddressStates: [],
    billingAddressStates: [],
    creditCardMonths: [],
    creditCardYears: [],
    isProcessingPayment: false,
    paymentError: null,
    clientSecret: null,
    isStripeInitialized: false,
    stripeError: null,
    loading: false,
    error: null,
};
