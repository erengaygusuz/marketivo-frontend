import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { OrderHistoryService } from '../../services/order-history.service';
import * as AuthActions from '../auth/auth.actions';
import * as OrderHistoryActions from './order-history.actions';

@Injectable()
export class OrderHistoryEffects {
    private actions$ = inject(Actions);
    private orderHistoryService = inject(OrderHistoryService);

    loadOrderHistory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderHistoryActions.loadOrderHistory),
            switchMap(({ email }) =>
                this.orderHistoryService.getOrderHistory(email).pipe(
                    map(response => OrderHistoryActions.loadOrderHistorySuccess({ response })),
                    catchError((error: unknown) => {
                        let errorMessage = 'An error occurred while loading order history';

                        if (error && typeof error === 'object' && 'status' in error) {
                            const httpError = error as { status: number; message?: string };

                            if (httpError.status === 401) {
                                errorMessage = 'Authentication failed';
                            } else if (httpError.status === 403) {
                                errorMessage = 'Access denied';
                            } else if (httpError.status === 404) {
                                errorMessage = 'Service not found';
                            } else if (httpError.message) {
                                errorMessage = httpError.message;
                            }
                        } else if (error && typeof error === 'object' && 'message' in error) {
                            const genericError = error as { message: string };

                            errorMessage = genericError.message;
                        }

                        return of(OrderHistoryActions.loadOrderHistoryFailure({ error: errorMessage }));
                    })
                )
            )
        )
    );

    // Clear order history when user logs out
    clearOrderHistoryOnLogout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logoutSuccess, AuthActions.clearUser),
            map(() => OrderHistoryActions.clearOrderHistory())
        )
    );
}
