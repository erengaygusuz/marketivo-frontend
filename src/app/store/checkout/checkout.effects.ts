import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CheckoutService } from '../../services/checkout.service';
import { CountryStateService } from '../../services/country-state.service';
import { AppState } from '../app.state';
import * as CartActions from '../cart/cart.actions';
import * as CheckoutActions from './checkout.actions';

@Injectable()
export class CheckoutEffects {
    private actions$ = inject(Actions);
    private store = inject(Store<AppState>);
    private countryStateService = inject(CountryStateService);
    private checkoutService = inject(CheckoutService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translate = inject(TranslateService);

    loadCountries$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CheckoutActions.loadCountries),
            switchMap(() =>
                this.countryStateService.getCountries().pipe(
                    map(countries => CheckoutActions.loadCountriesSuccess({ countries })),
                    catchError(error => of(CheckoutActions.loadCountriesFailure({ error: error.message })))
                )
            )
        )
    );

    loadStates$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CheckoutActions.loadStates),
            switchMap(({ countryCode, addressType }) =>
                this.countryStateService.getStates(countryCode).pipe(
                    map(states => CheckoutActions.loadStatesSuccess({ states, addressType })),
                    catchError(error => of(CheckoutActions.loadStatesFailure({ error: error.message })))
                )
            )
        )
    );

    createPaymentIntent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CheckoutActions.createPaymentIntent),
            switchMap(({ paymentInfo }) =>
                this.checkoutService.createPaymentIntent(paymentInfo).pipe(
                    map(response =>
                        CheckoutActions.createPaymentIntentSuccess({ clientSecret: response.client_secret })
                    ),
                    catchError(error => of(CheckoutActions.createPaymentIntentFailure({ error: error.message })))
                )
            )
        )
    );

    placeOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CheckoutActions.placeOrder),
            switchMap(({ purchase }) =>
                this.checkoutService.placeOrder(purchase).pipe(
                    map(response =>
                        CheckoutActions.placeOrderSuccess({ orderTrackingNumber: response.orderTrackingNumber })
                    ),
                    catchError(error => of(CheckoutActions.placeOrderFailure({ error: error.message })))
                )
            )
        )
    );

    placeOrderSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(CheckoutActions.placeOrderSuccess),
                tap(({ orderTrackingNumber }) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('Checkout.OrderSuccessSummary'),
                        detail: this.translate.instant('Checkout.OrderSuccessDetail', {
                            trackingNumber: orderTrackingNumber,
                        }),
                        life: 5000,
                    });

                    // Clear cart and navigate
                    setTimeout(() => {
                        this.store.dispatch(CartActions.clearCart());
                        this.router.navigateByUrl('/products');
                    }, 2000);
                })
            ),
        { dispatch: false }
    );

    handleErrors$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(CheckoutActions.createPaymentIntentFailure, CheckoutActions.placeOrderFailure),
                tap(({ error }) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translate.instant('Checkout.ErrorSummary'),
                        detail: this.translate.instant('Checkout.ErrorDetail', { error }),
                        life: 5000,
                    });
                })
            ),
        { dispatch: false }
    );
}
