import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Country } from '../../common/models/country';
import { State } from '../../common/models/state';
import { CustomValidator } from '../../validators/custom-validator';
import { PaymentInfo } from '../../common/models/payment-info';
import { CountryStateService } from '../../services/country-state.service';
import { Order } from '../../common/models/order';
import { OrderItem } from '../../common/models/order-item';
import { Purchase } from '../../common/models/purchase';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css'],
    imports: [CommonModule, ReactiveFormsModule, FluidModule, SelectModule, FormsModule, InputTextModule, TextareaModule, MessageModule, CheckboxModule, CardModule, ButtonModule]
})
export class CheckoutComponent implements AfterViewInit, OnInit {
    isBillingSameAsShipping = false;
    totalPrice: number = 0;
    totalQuantity = 0;

    creditCardYears: number[] = [];
    creditCardMonths: number[] = [];

    countries: Country[] = [];
    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

    storage: Storage = sessionStorage;

    userEmail: string = JSON.parse(this.storage.getItem('userEmail')!);

    checkoutFormGroup: FormGroup = new FormGroup({});

    paymentInfo: PaymentInfo = new PaymentInfo();
    cardElement: any;
    displayError: any = '';

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
        private messageService: MessageService
    ) {
        this.countryStateService.getCountries().subscribe((data) => {
            this.countries = data;
        });

        this.checkoutFormGroup = new FormGroup({
            customer: this.formBuilder.group({
                firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                email: new FormControl(this.userEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), CustomValidator.notOnlyWhitespace])
            }),
            shippingAddress: this.formBuilder.group({
                street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace])
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace])
            }),
            creditCard: this.formBuilder.group({})
        });
    }

    async ngAfterViewInit() {
        this.stripe = await loadStripe(environment.stripePublishableKey);
        if (!this.stripe) return;
        this.setupStripePaymentForm();
    }

    ngOnInit() {
        this.reviewCartDetails();
    }

    setupStripePaymentForm() {
        if (!this.stripe) {
            console.log('Stripe not yet initialized');
            return;
        }
        
        this.elements = this.stripe.elements();
        this.cardElement = this.elements.create('card', {
            hidePostalCode: true
        });
        this.cardElement.mount('#card-element');
        this.cardElement.on('change', (event: any) => {
            if (event.error) {
                this.displayError = event.error.message;
            } else {
                this.displayError = null;
            }
        });
    }

    reviewCartDetails() {
        this.cartService.totalPrice.subscribe((data) => {
            this.totalPrice = data;
            console.log('Total Price updated:', this.totalPrice);
        });

        this.cartService.totalQuantity.subscribe((data) => {
            this.totalQuantity = data;
            console.log('Total Quantity updated:', this.totalQuantity);
        });
    }

    onSubmit() {
        console.log('onSubmit called');
        console.log('Form valid:', this.checkoutFormGroup.valid);
        console.log('Display error:', this.displayError);
        console.log('Total price:', this.totalPrice);
        console.log('Total quantity:', this.totalQuantity);
        console.log('Cart items:', this.cartService.cartItems);
        
        if (this.checkoutFormGroup.invalid) {
            console.log('Form is invalid, marking all touched');
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }

        if (this.cartService.cartItems.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Empty Cart',
                detail: 'Your cart is empty. Please add items to cart before checkout.',
                life: 5000
            });
            return;
        }

        if (this.totalPrice === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Empty Cart',
                detail: 'Order total is $0. Please add items to cart before checkout.',
                life: 5000
            });
            return;
        }

        let order = new Order();
        order.totalPrice = this.totalPrice;
        order.totalQuantity = this.totalQuantity;

        const cartItems = this.cartService.cartItems;

        let orderItems: OrderItem[] = cartItems.map((tempCartItem) => new OrderItem(tempCartItem));

        let purchase = new Purchase();

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

        console.log('Validation check - Form valid:', !this.checkoutFormGroup.invalid);
        console.log('Validation check - No display error:', !this.displayError);
        console.log('Payment info:', this.paymentInfo);
        console.log('Purchase object:', purchase);

        if (!this.checkoutFormGroup.invalid && !this.displayError) {
            console.log('Proceeding with payment...');
            this.isDisabled = true;
            this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe({
                next: (paymentIntentResponse) => {
                    console.log('Payment intent created:', paymentIntentResponse);
                    this.stripe!.confirmCardPayment(
                    paymentIntentResponse.client_secret,
                    {
                        payment_method: {
                            card: this.cardElement,
                            billing_details: {
                                email: purchase.customer.email,
                                name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                                address: {
                                    line1: purchase.shippingAddress.street,
                                    city: purchase.shippingAddress.city,
                                    state: purchase.shippingAddress.state,
                                    postal_code: purchase.shippingAddress.zipCode,
                                    country: this.shippingAddressCountry?.value.code
                                }
                            }
                        }
                    },
                    { handleActions: false }
                ).then((result: any) => {
                    if (result.error) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Payment Error',
                            detail: `There was an error processing your payment: ${result.error.message}`,
                            life: 5000
                        });
                        this.isDisabled = false;
                    } else {
                        this.checkoutService.placeOrder(purchase).subscribe({
                            next: (response) => {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Order Successful',
                                    detail: `Your order has been received. Order tracking number: ${response.orderTrackingNumber}`,
                                    life: 5000
                                });
                                // Add a small delay before redirect to show the toast
                                setTimeout(() => {
                                    this.resetCart();
                                }, 2000);
                                this.isDisabled = false;
                            },
                            error: (err) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Order Error',
                                    detail: `There was an error placing your order: ${err.message}`,
                                    life: 5000
                                });
                                this.isDisabled = false;
                            }
                        });
                    }
                });
                },
                error: (err) => {
                    console.error('Error creating payment intent:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Payment Intent Error',
                        detail: `There was an error creating the payment intent: ${err.message}`,
                        life: 5000
                    });
                    this.isDisabled = false;
                }
            });
        } else {
            console.log('Form validation failed or Stripe error present');
            console.log('Form invalid:', this.checkoutFormGroup.invalid);
            console.log('Display error:', this.displayError);
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }
    }

    resetCart() {
        this.cartService.cartItems = [];
        this.cartService.totalPrice.next(0);
        this.cartService.totalQuantity.next(0);

        this.cartService.persistCartItems();
        this.checkoutFormGroup.reset();

        this.router.navigateByUrl('/products');
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

    copyShippingAddressToBillingAddress(event: any) {
        if (event.checked) {
            this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
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

        this.countryStateService.getCreditCardMonths(startMonth).subscribe((data) => {
            this.creditCardMonths = data;
        });
    }

    getStates(formGroupName: string) {
        const formGroup = this.checkoutFormGroup.get(formGroupName);
        console.log(formGroup?.value);
        const countryCode = formGroup?.value.country.code;

        this.countryStateService.getStates(countryCode).subscribe((data) => {
            if (formGroupName === 'shippingAddress') {
                this.shippingAddressStates = data;
            } else {
                this.billingAddressStates = data;
            }

            formGroup?.get('state')?.setValue(data[0]);
        });
    }
}
