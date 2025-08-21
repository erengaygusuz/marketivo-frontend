import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthFacade } from '../../facades/auth.facade';
import { CartFacade } from '../../facades/cart.facade';
import { CheckoutFacade } from '../../facades/checkout.facade';
import { CartItem } from '../../models/cart-item';
import { CheckoutFormData } from '../../models/checkout-form-data';
import { Country } from '../../models/country';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { PaymentInfo } from '../../models/payment-info';
import { Purchase } from '../../models/purchase';
import { State } from '../../models/state';
import { CheckoutService } from '../../services/checkout.service';
import { FluentValidationService } from '../../services/fluent-validation.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    templateUrl: './app-checkout.component.html',
    styleUrls: ['./app-checkout.component.scss'],
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
export class AppCheckoutComponent implements AfterViewInit, OnInit, OnDestroy {
    isBillingSameAsShipping = false;
    totalPrice: number = 0;
    totalQuantity = 0;
    cartItems: CartItem[] = [];

    private destroy$ = new Subject<void>();

    countries: Country[] = [];
    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

    userEmail: string = '';
    loadingStates: boolean = false;
    loadingCountries: boolean = false;

    checkoutFormGroup: FormGroup = new FormGroup({});

    paymentInfo: PaymentInfo = new PaymentInfo();
    cardElement: StripeCardElement | undefined;

    isDisabled: boolean = false;
    stripeError: string | null = null;

    stripe: Stripe | null = null;
    elements: StripeElements | null = null;
    card: StripeCardElement | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private checkoutService: CheckoutService,
        private router: Router,
        private messageService: MessageService,
        private fluentValidationService: FluentValidationService,
        private authFacade: AuthFacade,
        private checkoutFacade: CheckoutFacade,
        private cartFacade: CartFacade
    ) {
        this.initializeForm();
    }

    private loadInitialData() {
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

        this.checkoutFormGroup.statusChanges.pipe(takeUntil(this.destroy$), debounceTime(100)).subscribe(() => {
            if (this.checkoutFormGroup.touched) {
                this.validateForm();
            }
        });
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
                this.stripeError = event.error.message;
            } else {
                this.stripeError = null;
            }
        });
    }

    async ngAfterViewInit() {
        this.stripe = await loadStripe(environment.stripePublishableKey);

        if (!this.stripe) {
            this.stripeError = 'Failed to initialize Stripe';

            return;
        }

        this.setupStripePaymentForm();
    }

    ngOnInit() {
        this.loadInitialData();
        this.subscribeToStoreData();
    }

    private subscribeToStoreData() {
        this.authFacade.userEmail$.pipe(takeUntil(this.destroy$)).subscribe(email => {
            this.userEmail = email || '';

            const emailControl = this.checkoutFormGroup.get('customer.email');

            if (emailControl && emailControl.value !== this.userEmail) {
                emailControl.setValue(this.userEmail);
            }
        });

        this.checkoutFacade.countries$.pipe(takeUntil(this.destroy$)).subscribe(countries => {
            this.countries = countries;
        });

        this.checkoutFacade.shippingAddressStates$.pipe(takeUntil(this.destroy$)).subscribe(states => {
            this.shippingAddressStates = states;
        });

        this.checkoutFacade.billingAddressStates$.pipe(takeUntil(this.destroy$)).subscribe(states => {
            this.billingAddressStates = states;
        });

        this.cartFacade.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(cartItems => {
            this.cartItems = cartItems;
        });

        this.cartFacade.totalPrice$.pipe(takeUntil(this.destroy$)).subscribe(totalPrice => {
            this.totalPrice = totalPrice;
        });

        this.cartFacade.totalQuantity$.pipe(takeUntil(this.destroy$)).subscribe(totalQuantity => {
            this.totalQuantity = totalQuantity;
        });
    }

    private async confirmPaymentWithStripe(clientSecret: string): Promise<void> {
        if (!this.stripe || !this.cardElement) {
            this.stripeError = 'Stripe is not properly initialized';
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
                this.stripeError = 'Payment failed';
                this.isDisabled = false;
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                this.placeOrder();
            }
        } catch {
            this.stripeError = 'An unexpected error occurred during payment processing';
            this.isDisabled = false;
        }
    }

    private placeOrder(): void {
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

        this.checkoutFacade.placeOrder(purchase);
    }

    onSubmit() {
        const formData: CheckoutFormData = {
            customer: this.checkoutFormGroup.controls['customer'].value,
            shippingAddress: this.checkoutFormGroup.controls['shippingAddress'].value,
            billingAddress: this.checkoutFormGroup.controls['billingAddress'].value,
        };

        const hasValidationErrors = this.fluentValidationService.validateCheckoutForm(this.checkoutFormGroup, formData);

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

        this.paymentInfo.amount = Math.round(this.totalPrice * 100);
        this.paymentInfo.currency = 'USD';
        this.paymentInfo.receiptEmail = this.checkoutFormGroup.get('customer.email')?.value;

        if (!this.stripeError) {
            this.isDisabled = true;

            this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe({
                next: response => {
                    if (response.client_secret && this.stripe && this.cardElement) {
                        this.confirmPaymentWithStripe(response.client_secret);
                    }
                },
                error: _error => {
                    this.stripeError = 'Failed to create payment intent';
                    this.isDisabled = false;
                },
            });
        } else {
            this.checkoutFormGroup.markAllAsTouched();
        }
    }

    resetCart() {
        this.checkoutFacade.resetCheckout();
        this.checkoutFormGroup.reset();
        this.router.navigateByUrl('/products');
    }

    hasFieldError(control: AbstractControl | null): boolean {
        return this.fluentValidationService.hasFieldError(control);
    }

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
        return this.stripeError;
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

    getStates(formGroupName: string) {
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

        const addressType = formGroupName === 'shippingAddress' ? 'shipping' : 'billing';

        this.loadingStates = true;

        const stateControl = formGroup.get('state');

        if (stateControl) {
            stateControl.setValue(null);
        }

        this.checkoutFacade.loadStates(countryCode, addressType);

        setTimeout(() => {
            this.loadingStates = false;
        }, 500);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
