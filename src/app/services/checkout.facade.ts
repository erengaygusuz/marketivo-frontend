import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../common/models/cart-item';
import { Country } from '../common/models/country';
import { PaymentInfo } from '../common/models/payment-info';
import { Purchase } from '../common/models/purchase';
import { State } from '../common/models/state';
import { AppState } from '../store/app.state';
import * as CartSelectors from '../store/cart/cart.selectors';
import * as CheckoutActions from '../store/checkout/checkout.actions';
import * as CheckoutSelectors from '../store/checkout/checkout.selectors';

@Injectable({
    providedIn: 'root',
})
export class CheckoutFacade {
    constructor(private store: Store<AppState>) {}

    // Cart Data (from cart store)
    get cartItems$(): Observable<CartItem[]> {
        return this.store.select(CartSelectors.selectCartItems);
    }

    get totalPrice$(): Observable<number> {
        return this.store.select(CartSelectors.selectCartTotalPrice);
    }

    get totalQuantity$(): Observable<number> {
        return this.store.select(CartSelectors.selectCartTotalQuantity);
    }

    // Selectors - Form Data
    get countries$(): Observable<Country[]> {
        return this.store.select(CheckoutSelectors.selectCountries);
    }

    get shippingAddressStates$(): Observable<State[]> {
        return this.store.select(CheckoutSelectors.selectShippingAddressStates);
    }

    get billingAddressStates$(): Observable<State[]> {
        return this.store.select(CheckoutSelectors.selectBillingAddressStates);
    }

    get creditCardMonths$(): Observable<number[]> {
        return this.store.select(CheckoutSelectors.selectCreditCardMonths);
    }

    get creditCardYears$(): Observable<number[]> {
        return this.store.select(CheckoutSelectors.selectCreditCardYears);
    }

    // Selectors - Loading & Error States
    get loading$(): Observable<boolean> {
        return this.store.select(CheckoutSelectors.selectCheckoutLoading);
    }

    get error$(): Observable<string | null> {
        return this.store.select(CheckoutSelectors.selectCheckoutError);
    }

    get isProcessingPayment$(): Observable<boolean> {
        return this.store.select(CheckoutSelectors.selectIsProcessingPayment);
    }

    get paymentError$(): Observable<string | null> {
        return this.store.select(CheckoutSelectors.selectPaymentError);
    }

    get clientSecret$(): Observable<string | null> {
        return this.store.select(CheckoutSelectors.selectClientSecret);
    }

    // Selectors - Stripe
    get isStripeInitialized$(): Observable<boolean> {
        return this.store.select(CheckoutSelectors.selectIsStripeInitialized);
    }

    get stripeError$(): Observable<string | null> {
        return this.store.select(CheckoutSelectors.selectStripeError);
    }

    // Actions - Data Loading
    loadCountries(): void {
        this.store.dispatch(CheckoutActions.loadCountries());
    }

    loadStates(countryCode: string, addressType: 'shipping' | 'billing'): void {
        this.store.dispatch(CheckoutActions.loadStates({ countryCode, addressType }));
    }

    loadCreditCardMonths(startMonth: number): void {
        this.store.dispatch(CheckoutActions.loadCreditCardMonths({ startMonth }));
    }

    // Actions - Payment Processing
    createPaymentIntent(paymentInfo: PaymentInfo): void {
        this.store.dispatch(CheckoutActions.createPaymentIntent({ paymentInfo }));
    }

    placeOrder(purchase: Purchase): void {
        this.store.dispatch(CheckoutActions.placeOrder({ purchase }));
    }

    setPaymentProcessing(isProcessing: boolean): void {
        this.store.dispatch(CheckoutActions.setPaymentProcessing({ isProcessing }));
    }

    // Actions - Reset & Error Handling
    resetCheckout(): void {
        this.store.dispatch(CheckoutActions.resetCheckout());
    }

    clearError(): void {
        this.store.dispatch(CheckoutActions.clearCheckoutError());
    }

    clearPaymentError(): void {
        this.store.dispatch(CheckoutActions.clearPaymentError());
    }

    // Actions - Stripe
    initializeStripe(): void {
        this.store.dispatch(CheckoutActions.initializeStripe());
    }

    initializeStripeSuccess(): void {
        this.store.dispatch(CheckoutActions.initializeStripeSuccess());
    }

    setStripeError(error: string): void {
        this.store.dispatch(CheckoutActions.setStripeError({ error }));
    }

    clearStripeError(): void {
        this.store.dispatch(CheckoutActions.clearStripeError());
    }

    // Helper methods
    getCurrentCartData(): Observable<{ cartItems: CartItem[]; totalPrice: number; totalQuantity: number }> {
        return this.store.select(state => ({
            cartItems: CartSelectors.selectCartItems(state),
            totalPrice: CartSelectors.selectCartTotalPrice(state),
            totalQuantity: CartSelectors.selectCartTotalQuantity(state),
        }));
    }

    getFormData(): Observable<{ countries: Country[]; shippingStates: State[]; billingStates: State[] }> {
        return this.store.select(state => ({
            countries: CheckoutSelectors.selectCountries(state),
            shippingStates: CheckoutSelectors.selectShippingAddressStates(state),
            billingStates: CheckoutSelectors.selectBillingAddressStates(state),
        }));
    }
}
