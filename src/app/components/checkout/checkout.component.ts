import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
    loadStripe,
    PaymentIntentResult,
    Stripe,
    StripeCardElement,
    StripeCardElementChangeEvent,
    StripeElements,
} from '@stripe/stripe-js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from '../../common/models/cart-item';
import { Country } from '../../common/models/country';
import { Order } from '../../common/models/order';
import { OrderItem } from '../../common/models/order-item';
import { PaymentInfo } from '../../common/models/payment-info';
import { Purchase } from '../../common/models/purchase';
import { State } from '../../common/models/state';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { CountryStateService } from '../../services/country-state.service';
import { FluentValidationService } from '../../services/fluent-validation.service';
import { CheckoutFormData } from '../../validators/checkout-form.validator';

@Component({
    selector: 'app-checkout',
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

    storage: Storage = sessionStorage;

    userEmail: string = this.getUserEmailFromStorage();

    checkoutFormGroup: FormGroup = new FormGroup({});

    paymentInfo: PaymentInfo = new PaymentInfo();
    cardElement: StripeCardElement | undefined;
    displayError: string = '';

    isDisabled: boolean = false;

    stripe: Stripe | null = null;
    elements: StripeElements | null = null;
    card: StripeCardElement | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private countryStateService: CountryStateService,
        private cartService: CartService,
        private checkoutService: CheckoutService,
        private router: Router,
        private messageService: MessageService,
        private fluentValidationService: FluentValidationService,
        private translate: TranslateService
    ) {
        this.countryStateService.getCountries().subscribe(data => {
            this.countries = data;
        });

        this.initializeForm();
    }

    private getUserEmailFromStorage(): string {
        const userEmailFromStorage = this.storage.getItem('userEmail');

        return userEmailFromStorage ? JSON.parse(userEmailFromStorage) : '';
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
                state: new FormControl(''),
                country: new FormControl(''),
                zipCode: new FormControl(''),
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl(''),
                city: new FormControl(''),
                state: new FormControl(''),
                country: new FormControl(''),
                zipCode: new FormControl(''),
            }),
            creditCard: this.formBuilder.group({}),
        });

        // Subscribe to form value changes to trigger validation
        this.checkoutFormGroup.valueChanges.subscribe(() => {
            this.validateForm();
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

    async ngAfterViewInit() {
        this.stripe = await loadStripe(environment.stripePublishableKey);
        if (!this.stripe) {
            return;
        }
        this.setupStripePaymentForm();
    }

    ngOnInit() {
        this.reviewCartDetails();
        this.validateForm();
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
                this.displayError = await this.translateStripeError(event.error.message);
            } else {
                this.displayError = '';
            }
        });
    }

    reviewCartDetails() {
        this.cartService.totalPrice$.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.totalPrice = data;
        });

        this.cartService.totalQuantity$.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.totalQuantity = data;
        });

        this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(cartItems => {
            this.cartItems = cartItems;
        });
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

        this.paymentInfo.amount = Math.round(this.totalPrice * 100);
        this.paymentInfo.currency = 'USD';
        this.paymentInfo.receiptEmail = purchase.customer.email;

        if (!hasValidationErrors && !this.displayError) {
            this.isDisabled = true;
            this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe({
                next: paymentIntentResponse => {
                    this.stripe!.confirmCardPayment(
                        paymentIntentResponse.client_secret,
                        {
                            payment_method: {
                                card: this.cardElement!,
                                billing_details: {
                                    email: purchase.customer.email,
                                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                                    address: {
                                        line1: purchase.shippingAddress.street,
                                        city: purchase.shippingAddress.city,
                                        state: purchase.shippingAddress.state,
                                        postal_code: purchase.shippingAddress.zipCode,
                                        country: this.shippingAddressCountry?.value.code,
                                    },
                                },
                            },
                        },
                        { handleActions: false }
                    ).then((result: PaymentIntentResult) => {
                        if (result.error) {
                            this.messageService.add({
                                severity: 'error',
                                summary: this.translate.instant('Checkout.PaymentErrorSummary'),
                                detail: this.translate.instant('Checkout.PaymentErrorDetail', {
                                    error: result.error.message,
                                }),
                                life: 5000,
                            });
                            this.isDisabled = false;
                        } else {
                            this.checkoutService.placeOrder(purchase).subscribe({
                                next: response => {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: this.translate.instant('Checkout.OrderSuccessSummary'),
                                        detail: this.translate.instant('Checkout.OrderSuccessDetail', {
                                            trackingNumber: response.orderTrackingNumber,
                                        }),
                                        life: 5000,
                                    });
                                    // Add a small delay before redirect to show the toast
                                    setTimeout(() => {
                                        this.resetCart();
                                    }, 2000);
                                    this.isDisabled = false;
                                },
                                error: err => {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: this.translate.instant('Checkout.OrderErrorSummary'),
                                        detail: this.translate.instant('Checkout.OrderErrorDetail', {
                                            error: err.message,
                                        }),
                                        life: 5000,
                                    });
                                    this.isDisabled = false;
                                },
                            });
                        }
                    });
                },
                error: err => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translate.instant('Checkout.PaymentIntentErrorSummary'),
                        detail: this.translate.instant('Checkout.PaymentIntentErrorDetail', { error: err.message }),
                        life: 5000,
                    });
                    this.isDisabled = false;
                },
            });
        } else {
            this.checkoutFormGroup.markAllAsTouched();

            return;
        }
    }

    resetCart() {
        this.cartService.clearCart();
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

        this.countryStateService.getCreditCardMonths(startMonth).subscribe(data => {
            this.creditCardMonths = data;
        });
    }

    getStates(formGroupName: string) {
        const formGroup = this.checkoutFormGroup.get(formGroupName);

        const countryCode = formGroup?.value.country.code;

        this.countryStateService.getStates(countryCode).subscribe(data => {
            if (formGroupName === 'shippingAddress') {
                this.shippingAddressStates = data;
            } else {
                this.billingAddressStates = data;
            }

            formGroup?.get('state')?.setValue(data[0]);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
