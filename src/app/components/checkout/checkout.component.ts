import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { loadStripe, Stripe, StripeCardElement, StripeCardElementChangeEvent, StripeElements } from '@stripe/stripe-js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { debounceTime, firstValueFrom, Subject, take, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from '../../common/models/cart-item';
import { Country } from '../../common/models/country';
import { Order } from '../../common/models/order';
import { OrderItem } from '../../common/models/order-item';
import { PaymentInfo } from '../../common/models/payment-info';
import { Purchase } from '../../common/models/purchase';
import { State } from '../../common/models/state';
import { AuthFacade } from '../../services/auth.facade';
import { CheckoutFacade } from '../../services/checkout.facade';
import { FluentValidationService } from '../../services/fluent-validation.service';
import * as CheckoutActions from '../../store/checkout/checkout.actions';
import { CheckoutFormData } from '../../validators/checkout-form.validator';

@Component({
    selector: 'app-checkout',
    standalone: true,
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FluidModule,
        SelectModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        MessageModule,
        CheckboxModule,
        CardModule,
        ButtonModule,
        TranslateModule,
    ],
})
export class CheckoutComponent implements AfterViewInit, OnInit, OnDestroy {
    isBillingSameAsShipping = false;
    totalPrice: number = 0;
    totalQuantity = 0;
    cartItems: CartItem[] = [];
    private destroy$ = new Subject<void>();

    creditCardYears: number[] = [];
    creditCardMonths: number[] = [];

    countries: Country[] = [];
    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

    userEmail: string = '';
    loadingStates: boolean = false;

    checkoutFormGroup: FormGroup = new FormGroup({});

    paymentInfo: PaymentInfo = new PaymentInfo();
    cardElement: StripeCardElement | undefined;

    isDisabled: boolean = false;

    stripe: Stripe | null = null;
    elements: StripeElements | null = null;
    card: StripeCardElement | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private checkoutFacade: CheckoutFacade,
        private router: Router,
        private messageService: MessageService,
        private fluentValidationService: FluentValidationService,
        private translate: TranslateService,
        private authFacade: AuthFacade,
        private actions$: Actions
    ) {
        this.initializeForm();
    }

    private loadInitialData() {
        // Load countries for checkout form
        this.checkoutFacade.loadCountries();
    }

    private initializeForm() {
        this.checkoutFormGroup = new FormGroup({
            customer: this.formBuilder.group({
                firstName: new FormControl(''),
                lastName: new FormControl(''),
                email: new FormControl(this.userEmail),
            }),
            shippingAddress: this.formBuilder.group({
                street: new FormControl(''),
                city: new FormControl(''),
                state: new FormControl(null),
                country: new FormControl(null),
                zipCode: new FormControl(''),
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl(''),
                city: new FormControl(''),
                state: new FormControl(null),
                country: new FormControl(null),
                zipCode: new FormControl(''),
            }),
            creditCard: this.formBuilder.group({}),
        });

        // Subscribe to form status changes with debounce to prevent infinite loops
        this.checkoutFormGroup.statusChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100) // Add debounce to prevent rapid fire changes
            )
            .subscribe(() => {
                // Only validate if the form has been interacted with
                if (this.checkoutFormGroup.touched) {
                    this.validateForm();
                }
            });
    }

    private async translateStripeError(errorMessage: string): Promise<string> {
        // Map common Stripe error messages to translation keys
        const errorMappings: { [key: string]: string } = {
            'Your card number is incomplete.': 'CreditCard.IncompleteCardNumber',
            "Your card's expiration date is incomplete.": 'CreditCard.IncompleteExpiryDate',
            "Your card's security code is incomplete.": 'CreditCard.IncompleteCVC',
            'Your postal code is incomplete.': 'CreditCard.IncompletePostalCode',
            'Your card number is invalid.': 'CreditCard.InvalidCardNumber',
            "Your card's expiration date is invalid.": 'CreditCard.InvalidExpiryDate',
            "Your card's security code is invalid.": 'CreditCard.InvalidCVC',
            'Your card has expired.': 'CreditCard.ExpiredCard',
            "Your card's expiration year is in the past.": 'CreditCard.ExpiredYear',
            'Your card was declined.': 'CreditCard.DeclinedCard',
            'Your card does not support this type of purchase.': 'CreditCard.UnsupportedCard',
            'An error occurred while processing your card. Try again in a little bit.': 'CreditCard.ProcessingError',
            'Your card was declined. Your request was in test mode, but used a non test card.':
                'CreditCard.TestModeError',
        };

        // First try exact match
        let translationKey = errorMappings[errorMessage];

        // If no exact match, try trimmed version (in case of extra whitespace)
        if (!translationKey) {
            translationKey = errorMappings[errorMessage.trim()];
        }

        // If still no match, try case-insensitive matching for key phrases
        if (!translationKey) {
            const lowerMessage = errorMessage.toLowerCase();

            if (lowerMessage.includes('expiration year') && lowerMessage.includes('past')) {
                translationKey = 'CreditCard.ExpiredYear';
            } else if (lowerMessage.includes('card number') && lowerMessage.includes('incomplete')) {
                translationKey = 'CreditCard.IncompleteCardNumber';
            } else if (lowerMessage.includes('expiration date') && lowerMessage.includes('incomplete')) {
                translationKey = 'CreditCard.IncompleteExpiryDate';
            } else if (lowerMessage.includes('security code') && lowerMessage.includes('incomplete')) {
                translationKey = 'CreditCard.IncompleteCVC';
            } else if (lowerMessage.includes('card number') && lowerMessage.includes('invalid')) {
                translationKey = 'CreditCard.InvalidCardNumber';
            } else if (lowerMessage.includes('card has expired')) {
                translationKey = 'CreditCard.ExpiredCard';
            } else if (lowerMessage.includes('card was declined')) {
                translationKey = 'CreditCard.DeclinedCard';
            }
        }

        if (translationKey) {
            try {
                // Use async firstValueFrom for proper translation loading
                const translated = await firstValueFrom(this.translate.get(translationKey));

                return translated !== translationKey ? translated : errorMessage;
            } catch {
                return errorMessage;
            }
        }

        return errorMessage;
    }

    private validateForm() {
        const formData: CheckoutFormData = {
            customer: this.checkoutFormGroup.controls['customer'].value,
            shippingAddress: this.checkoutFormGroup.controls['shippingAddress'].value,
            billingAddress: this.checkoutFormGroup.controls['billingAddress'].value,
        };

        this.fluentValidationService.validateCheckoutForm(this.checkoutFormGroup, formData);
    }

    setupStripePaymentForm() {
        if (!this.stripe) {
            return;
        }

        this.elements = this.stripe.elements();
        this.cardElement = this.elements.create('card', {
            hidePostalCode: true,
        });
        this.cardElement.mount('#card-element');
        this.cardElement.on('change', async (event: StripeCardElementChangeEvent) => {
            if (event.error) {
                const translatedError = await this.translateStripeError(event.error.message);

                this.checkoutFacade.setStripeError(translatedError);
            } else {
                this.checkoutFacade.clearStripeError();
            }
        });
    }

    async ngAfterViewInit() {
        this.stripe = await loadStripe(environment.stripePublishableKey);

        if (!this.stripe) {
            this.checkoutFacade.setStripeError('Failed to initialize Stripe');

            return;
        }

        // Dispatch success action after Stripe is actually loaded
        this.checkoutFacade.initializeStripeSuccess();
    }

    ngOnInit() {
        this.loadInitialData();
        this.reviewCartDetails();
        this.subscribeToStoreData();
    }

    private subscribeToStoreData() {
        // Subscribe to user email from auth state
        this.authFacade.userEmail$.pipe(takeUntil(this.destroy$)).subscribe(email => {
            this.userEmail = email || '';

            // Update form control when email changes
            const emailControl = this.checkoutFormGroup.get('customer.email');

            if (emailControl && emailControl.value !== this.userEmail) {
                emailControl.setValue(this.userEmail);
            }
        });

        // Subscribe to countries
        this.checkoutFacade.countries$.pipe(takeUntil(this.destroy$)).subscribe(countries => {
            this.countries = countries;
        });

        // Subscribe to states
        this.checkoutFacade.shippingAddressStates$.pipe(takeUntil(this.destroy$)).subscribe(states => {
            this.shippingAddressStates = states;
        });

        this.checkoutFacade.billingAddressStates$.pipe(takeUntil(this.destroy$)).subscribe(states => {
            this.billingAddressStates = states;
        });

        // Subscribe to credit card months
        this.checkoutFacade.creditCardMonths$.pipe(takeUntil(this.destroy$)).subscribe(months => {
            this.creditCardMonths = months;
        });

        // Subscribe to Stripe initialization status
        this.checkoutFacade.isStripeInitialized$.pipe(takeUntil(this.destroy$)).subscribe(isInitialized => {
            if (isInitialized && this.stripe) {
                this.setupStripePaymentForm();
            }
        });

        // Subscribe to payment intent success to handle Stripe payment confirmation
        this.checkoutFacade.clientSecret$.pipe(takeUntil(this.destroy$)).subscribe(clientSecret => {
            if (clientSecret && this.stripe && this.cardElement) {
                this.confirmPaymentWithStripe(clientSecret);
            }
        });

        // Listen for order placement success to re-enable button after success message
        this.actions$.pipe(ofType(CheckoutActions.placeOrderSuccess), takeUntil(this.destroy$)).subscribe(() => {
            // Re-enable button after success message is shown (1 second delay)
            setTimeout(() => {
                this.isDisabled = false;
            }, 1000);
        });

        // Listen for order placement failure to re-enable button (success navigates away)
        this.actions$
            .pipe(
                ofType(CheckoutActions.placeOrderFailure, CheckoutActions.createPaymentIntentFailure),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.isDisabled = false;
            });
    }

    reviewCartDetails() {
        this.checkoutFacade.totalPrice$.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.totalPrice = data;
        });

        this.checkoutFacade.totalQuantity$.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.totalQuantity = data;
        });

        this.checkoutFacade.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(cartItems => {
            this.cartItems = cartItems;
        });
    }

    private async confirmPaymentWithStripe(clientSecret: string): Promise<void> {
        if (!this.stripe || !this.cardElement) {
            this.checkoutFacade.setStripeError('Stripe is not properly initialized');
            this.isDisabled = false;

            return;
        }

        try {
            const { error: paymentError, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        email: this.checkoutFormGroup.get('customer.email')?.value,
                        name: `${this.checkoutFormGroup.get('customer.firstName')?.value} ${this.checkoutFormGroup.get('customer.lastName')?.value}`,
                        address: {
                            line1: this.checkoutFormGroup.get('billingAddress.street')?.value,
                            city: this.checkoutFormGroup.get('billingAddress.city')?.value,
                            state: this.checkoutFormGroup.get('billingAddress.state')?.value?.name,
                            country: this.checkoutFormGroup.get('billingAddress.country')?.value?.code,
                            postal_code: this.checkoutFormGroup.get('billingAddress.zipCode')?.value,
                        },
                    },
                },
            });

            if (paymentError) {
                const translatedError = await this.translateStripeError(paymentError.message || 'Payment failed');

                this.checkoutFacade.setStripeError(translatedError);
                this.isDisabled = false;
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment succeeded, now place the order
                this.placeOrder();
            }
        } catch {
            this.checkoutFacade.setStripeError('An unexpected error occurred during payment processing');
            this.isDisabled = false;
        }
    }

    private placeOrder(): void {
        // Create the purchase object (this logic already exists in onSubmit)
        const order = new Order();

        order.totalPrice = this.totalPrice;
        order.totalQuantity = this.totalQuantity;

        const cartItems = this.cartItems;
        const orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

        const purchase = new Purchase();

        purchase.customer = this.checkoutFormGroup.controls['customer'].value;
        purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

        const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
        const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

        purchase.shippingAddress.state = shippingState.name;
        purchase.shippingAddress.country = shippingCountry.name;

        purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
        const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
        const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

        purchase.billingAddress.state = billingState.name;
        purchase.billingAddress.country = billingCountry.name;

        purchase.order = order;
        purchase.orderItems = orderItems;

        // Place the order through the facade
        this.checkoutFacade.placeOrder(purchase);
    }

    onSubmit() {
        const formData: CheckoutFormData = {
            customer: this.checkoutFormGroup.controls['customer'].value,
            shippingAddress: this.checkoutFormGroup.controls['shippingAddress'].value,
            billingAddress: this.checkoutFormGroup.controls['billingAddress'].value,
        };

        // Validate using fluent validation service
        const hasValidationErrors = this.fluentValidationService.validateCheckoutForm(this.checkoutFormGroup, formData);

        // Mark form as touched to show validation errors
        this.checkoutFormGroup.markAllAsTouched();

        if (hasValidationErrors) {
            return;
        }

        if (this.cartItems.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Empty Cart',
                detail: 'Your cart is empty. Please add items to cart before checkout.',
                life: 5000,
            });

            return;
        }

        if (this.totalPrice === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Empty Cart',
                detail: 'Order total is $0. Please add items to cart before checkout.',
                life: 5000,
            });

            return;
        }

        // Prepare payment info
        this.paymentInfo.amount = Math.round(this.totalPrice * 100);
        this.paymentInfo.currency = 'USD';
        this.paymentInfo.receiptEmail = this.checkoutFormGroup.get('customer.email')?.value;

        // Check for Stripe errors before processing
        this.checkoutFacade.stripeError$.pipe(take(1)).subscribe(stripeError => {
            if (!stripeError) {
                this.isDisabled = true;

                // Create payment intent through facade
                this.checkoutFacade.createPaymentIntent(this.paymentInfo);
            } else {
                this.checkoutFormGroup.markAllAsTouched();
            }
        });
    }

    resetCart() {
        this.checkoutFacade.resetCheckout();
        this.checkoutFormGroup.reset();
        this.router.navigateByUrl('/products');
    }

    /**
     * Delegate to service for template usage
     */
    hasFieldError(control: AbstractControl | null): boolean {
        return this.fluentValidationService.hasFieldError(control);
    }

    /**
     * Delegate to service for template usage
     */
    getFieldErrorMessage(control: AbstractControl | null): string {
        return this.fluentValidationService.getFieldErrorMessage(control);
    }

    get firstName() {
        return this.checkoutFormGroup.get('customer.firstName');
    }

    get lastName() {
        return this.checkoutFormGroup.get('customer.lastName');
    }

    get email() {
        return this.checkoutFormGroup.get('customer.email');
    }

    get shippingAddressStreet() {
        return this.checkoutFormGroup.get('shippingAddress.street');
    }

    get shippingAddressCity() {
        return this.checkoutFormGroup.get('shippingAddress.city');
    }

    get shippingAddressState() {
        return this.checkoutFormGroup.get('shippingAddress.state');
    }

    get shippingAddressCountry() {
        return this.checkoutFormGroup.get('shippingAddress.country');
    }

    get shippingAddressZipCode() {
        return this.checkoutFormGroup.get('shippingAddress.zipCode');
    }

    get billingAddressStreet() {
        return this.checkoutFormGroup.get('billingAddress.street');
    }

    get billingAddressCity() {
        return this.checkoutFormGroup.get('billingAddress.city');
    }

    get billingAddressState() {
        return this.checkoutFormGroup.get('billingAddress.state');
    }

    get billingAddressCountry() {
        return this.checkoutFormGroup.get('billingAddress.country');
    }

    get billingAddressZipCode() {
        return this.checkoutFormGroup.get('billingAddress.zipCode');
    }

    get stripeError$() {
        return this.checkoutFacade.stripeError$;
    }

    get creditCardType() {
        return this.checkoutFormGroup.get('creditCard.cardType');
    }

    get creditCardNameOnCard() {
        return this.checkoutFormGroup.get('creditCard.nameOnCard');
    }

    get creditCardNumber() {
        return this.checkoutFormGroup.get('creditCard.cardNumber');
    }

    get creditCardSecurityCode() {
        return this.checkoutFormGroup.get('creditCard.securityCode');
    }

    copyShippingAddressToBillingAddress(event: CheckboxChangeEvent) {
        if (event.checked) {
            this.checkoutFormGroup.controls['billingAddress'].setValue(
                this.checkoutFormGroup.controls['shippingAddress'].value
            );
            this.billingAddressStates = this.shippingAddressStates;
        } else {
            this.checkoutFormGroup.controls['billingAddress'].reset();
            this.billingAddressStates = [];
        }
    }

    handleMonthsAndYears() {
        const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

        const currentYear: number = new Date().getFullYear();
        const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

        let startMonth: number;

        if (currentYear === selectedYear) {
            startMonth = new Date().getMonth() + 1; // Current month
        } else {
            startMonth = 1; // January
        }

        this.checkoutFacade.loadCreditCardMonths(startMonth);
    }

    getStates(formGroupName: string) {
        // Prevent multiple rapid calls
        if (this.loadingStates) {
            return;
        }

        const formGroup = this.checkoutFormGroup.get(formGroupName);

        if (!formGroup) {
            return;
        }

        const countryControl = formGroup.get('country');

        if (!countryControl || !countryControl.value) {
            return;
        }

        const country = countryControl.value;

        if (!country || !country.code) {
            return;
        }

        const countryCode = country.code;

        // Map form group names to address types
        const addressType = formGroupName === 'shippingAddress' ? 'shipping' : 'billing';

        // Set loading flag to prevent multiple calls
        this.loadingStates = true;

        // Clear the state selection when country changes
        const stateControl = formGroup.get('state');

        if (stateControl) {
            stateControl.setValue(null);
        }

        this.checkoutFacade.loadStates(countryCode, addressType);

        // Reset loading flag after a short delay
        setTimeout(() => {
            this.loadingStates = false;
        }, 500);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
