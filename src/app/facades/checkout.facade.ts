import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Country } from '../models/country';
import { PaymentInfo } from '../models/payment-info';
import { Purchase } from '../models/purchase';
import { State } from '../models/state';
import { AppState } from '../store/app.state';
import * as CheckoutActions from '../store/checkout/checkout.actions';
import * as CheckoutSelectors from '../store/checkout/checkout.selectors';

@Injectable({
    providedIn: 'root',
})
export class CheckoutFacade {
    constructor(private store: Store<AppState>) {}

    get countries$(): Observable<Country[]> {
        return this.store.select(CheckoutSelectors.selectCountries);
    }

    get shippingAddressStates$(): Observable<State[]> {
        return this.store.select(CheckoutSelectors.selectShippingAddressStates);
    }

    get billingAddressStates$(): Observable<State[]> {
        return this.store.select(CheckoutSelectors.selectBillingAddressStates);
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

    // Actions - Data Loading
    loadCountries(): void {
        this.store.dispatch(CheckoutActions.loadCountries());
    }

    loadStates(countryCode: string, addressType: 'shipping' | 'billing'): void {
        this.store.dispatch(CheckoutActions.loadStates({ countryCode, addressType }));
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

    getFormData(): Observable<{ countries: Country[]; shippingStates: State[]; billingStates: State[] }> {
        return this.store.select(state => ({
            countries: CheckoutSelectors.selectCountries(state),
            shippingStates: CheckoutSelectors.selectShippingAddressStates(state),
            billingStates: CheckoutSelectors.selectBillingAddressStates(state),
        }));
    }
}
