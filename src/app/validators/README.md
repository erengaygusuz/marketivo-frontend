# Validators Documentation

This directory contains custom form validation logic using FluentValidation-TS. The validators provide comprehensive, type-safe validation with internationalized error messages for forms throughout the application.

## 📁 Structure

```
validators/
└── checkout-form.validator.ts    # Checkout form validation rules
```

## 🎯 Validation Philosophy

The application uses FluentValidation-TS for several key advantages:

- **Type Safety** - Full TypeScript support with compile-time validation
- **Fluent API** - Readable, chainable validation rules
- **Internationalization** - Error messages support i18n
- **Composability** - Validators can be combined and reused
- **Testability** - Easy to unit test validation logic
- **Separation of Concerns** - Validation logic separated from components

## 🏗️ FluentValidation-TS Integration

### Base Validator Structure

```typescript
import { Validator } from 'fluentvalidation-ts';

export class FeatureValidator extends Validator<FeatureData> {
    constructor() {
        super();

        this.ruleFor('propertyName')
            .notEmpty()
            .withMessage('Validation.PropertyRequired')
            .must(this.customValidationRule)
            .withMessage('Validation.CustomError');
    }

    private customValidationRule = (value: string): boolean => {
        // Custom validation logic
        return value.trim().length > 0;
    };
}
```

### Available Validators

#### CustomerValidator

Validates customer information in checkout forms.

**Validated Properties:**
- `firstName` - Customer's first name
- `lastName` - Customer's last name  
- `email` - Customer's email address

**Validation Rules:**
```typescript
export class CustomerValidator extends Validator<CustomerData> {
    constructor() {
        super();

        this.ruleFor('firstName')
            .notEmpty()
            .withMessage('Validation.FirstNameRequired')
            .minLength(2)
            .withMessage('Validation.FirstNameMinLength')
            .must(this.notOnlyWhitespace)
            .withMessage('Validation.FirstNameWhitespace');

        this.ruleFor('lastName')
            .notEmpty()
            .withMessage('Validation.LastNameRequired')
            .minLength(2)
            .withMessage('Validation.LastNameMinLength')
            .must(this.notOnlyWhitespace)
            .withMessage('Validation.LastNameWhitespace');

        this.ruleFor('email')
            .notEmpty()
            .withMessage('Validation.EmailRequired')
            .emailAddress()
            .withMessage('Validation.EmailFormat')
            .must(this.isValidEmailDomain)
            .withMessage('Validation.EmailDomain');
    }

    private notOnlyWhitespace = (value: string): boolean => {
        return value ? value.trim().length > 0 : false;
    };

    private isValidEmailDomain = (email: string): boolean => {
        if (!email) return false;
        const domain = email.split('@')[1];
        return domain && domain.includes('.');
    };
}
```

#### AddressValidator

Validates shipping and billing address information.

**Validated Properties:**
- `street` - Street address
- `city` - City name
- `state` - State/province
- `country` - Country selection
- `zipCode` - Postal/ZIP code

**Validation Rules:**
```typescript
export class AddressValidator extends Validator<AddressData> {
    constructor(
        private countries: Country[],
        private states: State[]
    ) {
        super();

        this.ruleFor('street')
            .notEmpty()
            .withMessage('Validation.StreetRequired')
            .minLength(5)
            .withMessage('Validation.StreetMinLength')
            .must(this.notOnlyWhitespace)
            .withMessage('Validation.StreetWhitespace');

        this.ruleFor('city')
            .notEmpty()
            .withMessage('Validation.CityRequired')
            .minLength(2)
            .withMessage('Validation.CityMinLength')
            .matches(/^[a-zA-Z\s\-']+$/)
            .withMessage('Validation.CityFormat');

        this.ruleFor('state')
            .notEmpty()
            .withMessage('Validation.StateRequired')
            .must(this.isValidState)
            .withMessage('Validation.StateInvalid');

        this.ruleFor('country')
            .notEmpty()
            .withMessage('Validation.CountryRequired')
            .must(this.isValidCountry)
            .withMessage('Validation.CountryInvalid');

        this.ruleFor('zipCode')
            .notEmpty()
            .withMessage('Validation.ZipCodeRequired')
            .must(this.isValidZipCode)
            .withMessage('Validation.ZipCodeFormat');
    }

    private isValidCountry = (countryCode: string): boolean => {
        return this.countries.some(country => country.code === countryCode);
    };

    private isValidState = (stateCode: string): boolean => {
        return this.states.some(state => state.code === stateCode);
    };

    private isValidZipCode = (zipCode: string): boolean => {
        if (!zipCode) return false;
        
        // US ZIP code format
        const usZipRegex = /^\d{5}(-\d{4})?$/;
        // UK postal code format
        const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
        // Canadian postal code format
        const caPostalRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
        
        return usZipRegex.test(zipCode) || 
               ukPostcodeRegex.test(zipCode) || 
               caPostalRegex.test(zipCode);
    };
}
```

#### PaymentValidator

Validates payment information including credit card details.

**Validated Properties:**
- `cardType` - Credit card type
- `nameOnCard` - Cardholder name
- `cardNumber` - Credit card number
- `securityCode` - CVV/CVC code
- `expirationMonth` - Expiration month
- `expirationYear` - Expiration year

**Validation Rules:**
```typescript
export class PaymentValidator extends Validator<PaymentInfo> {
    constructor() {
        super();

        this.ruleFor('cardType')
            .notEmpty()
            .withMessage('Validation.CardTypeRequired')
            .must(this.isValidCardType)
            .withMessage('Validation.CardTypeInvalid');

        this.ruleFor('nameOnCard')
            .notEmpty()
            .withMessage('Validation.NameOnCardRequired')
            .minLength(2)
            .withMessage('Validation.NameOnCardMinLength')
            .matches(/^[a-zA-Z\s\-']+$/)
            .withMessage('Validation.NameOnCardFormat');

        this.ruleFor('cardNumber')
            .notEmpty()
            .withMessage('Validation.CardNumberRequired')
            .must(this.isValidCardNumber)
            .withMessage('Validation.CardNumberInvalid');

        this.ruleFor('securityCode')
            .notEmpty()
            .withMessage('Validation.SecurityCodeRequired')
            .must(this.isValidSecurityCode)
            .withMessage('Validation.SecurityCodeInvalid');

        this.ruleFor('expirationMonth')
            .notEmpty()
            .withMessage('Validation.ExpirationMonthRequired')
            .must(this.isValidMonth)
            .withMessage('Validation.ExpirationMonthInvalid');

        this.ruleFor('expirationYear')
            .notEmpty()
            .withMessage('Validation.ExpirationYearRequired')
            .must(this.isValidYear)
            .withMessage('Validation.ExpirationYearInvalid');
    }

    private isValidCardType = (cardType: string): boolean => {
        const validTypes = ['Visa', 'MasterCard', 'American Express', 'Discover'];
        return validTypes.includes(cardType);
    };

    private isValidCardNumber = (cardNumber: string): boolean => {
        if (!cardNumber) return false;
        
        // Remove spaces and dashes
        const cleanNumber = cardNumber.replace(/[\s\-]/g, '');
        
        // Check if all digits
        if (!/^\d+$/.test(cleanNumber)) return false;
        
        // Luhn algorithm validation
        return this.luhnCheck(cleanNumber);
    };

    private luhnCheck = (cardNumber: string): boolean => {
        let sum = 0;
        let alternate = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return sum % 10 === 0;
    };

    private isValidSecurityCode = (code: string): boolean => {
        if (!code) return false;
        return /^\d{3,4}$/.test(code);
    };

    private isValidMonth = (month: string): boolean => {
        const monthNum = parseInt(month);
        return monthNum >= 1 && monthNum <= 12;
    };

    private isValidYear = (year: string): boolean => {
        const yearNum = parseInt(year);
        const currentYear = new Date().getFullYear();
        return yearNum >= currentYear && yearNum <= currentYear + 20;
    };
}
```

#### CheckoutFormValidator

Composite validator for the entire checkout form.

**Features:**
- Validates all checkout steps
- Conditional validation based on form state
- Cross-field validation
- Business rule validation

```typescript
export class CheckoutFormValidator extends Validator<CheckoutFormData> {
    private customerValidator: CustomerValidator;
    private shippingValidator: AddressValidator;
    private billingValidator: AddressValidator;
    private paymentValidator: PaymentValidator;

    constructor(
        countries: Country[],
        states: State[]
    ) {
        super();

        this.customerValidator = new CustomerValidator();
        this.shippingValidator = new AddressValidator(countries, states);
        this.billingValidator = new AddressValidator(countries, states);
        this.paymentValidator = new PaymentValidator();

        this.setupValidationRules();
    }

    private setupValidationRules(): void {
        // Customer validation
        this.ruleFor('customer')
            .setValidator(this.customerValidator);

        // Shipping address validation
        this.ruleFor('shippingAddress')
            .setValidator(this.shippingValidator);

        // Billing address validation (conditional)
        this.ruleFor('billingAddress')
            .setValidator(this.billingValidator)
            .when(data => !data.useSameAddress);

        // Payment validation
        this.ruleFor('paymentInfo')
            .setValidator(this.paymentValidator);

        // Cross-field validation
        this.ruleFor('billingAddress')
            .must(this.validateBillingAddress)
            .withMessage('Validation.BillingAddressRequired')
            .when(data => !data.useSameAddress);
    }

    private validateBillingAddress = (
        billingAddress: AddressData,
        checkoutData: CheckoutFormData
    ): boolean => {
        if (checkoutData.useSameAddress) {
            return true; // Skip validation if using same address
        }
        
        return !!billingAddress &&
               !!billingAddress.street &&
               !!billingAddress.city &&
               !!billingAddress.state &&
               !!billingAddress.country &&
               !!billingAddress.zipCode;
    };
}
```

## 🔧 Integration with Angular Forms

### Reactive Forms Integration

```typescript
export class CheckoutComponent implements OnInit {
    checkoutForm: FormGroup;
    private formValidator: CheckoutFormValidator;

    constructor(
        private fb: FormBuilder,
        private fluentValidationService: FluentValidationService,
        private countryStateService: CountryStateService,
        private translateService: TranslateService
    ) {
        this.initializeForm();
    }

    ngOnInit() {
        this.initializeValidator();
    }

    private initializeForm(): void {
        this.checkoutForm = this.fb.group({
            customer: this.fb.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]]
            }),
            shippingAddress: this.fb.group({
                street: ['', Validators.required],
                city: ['', Validators.required],
                state: ['', Validators.required],
                country: ['', Validators.required],
                zipCode: ['', Validators.required]
            }),
            billingAddress: this.fb.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: ['']
            }),
            paymentInfo: this.fb.group({
                cardType: ['', Validators.required],
                nameOnCard: ['', Validators.required],
                cardNumber: ['', Validators.required],
                securityCode: ['', Validators.required],
                expirationMonth: ['', Validators.required],
                expirationYear: ['', Validators.required]
            }),
            useSameAddress: [true]
        });
    }

    private async initializeValidator(): Promise<void> {
        const countries = await firstValueFrom(this.countryStateService.getCountries());
        const states = await firstValueFrom(this.countryStateService.getStates('US'));
        
        this.formValidator = new CheckoutFormValidator(
            countries.content,
            states.content
        );
    }

    onSubmit(): void {
        if (this.validateForm()) {
            this.processCheckout();
        }
    }

    private validateForm(): boolean {
        const formData = this.checkoutForm.value as CheckoutFormData;
        const validationResult = this.formValidator.validate(formData);

        if (!validationResult.isValid) {
            this.displayValidationErrors(validationResult.errors);
            return false;
        }

        return true;
    }

    private displayValidationErrors(errors: ValidationFailure[]): void {
        // Clear previous errors
        this.clearFormErrors();

        errors.forEach(error => {
            const control = this.getFormControl(error.propertyName);
            if (control) {
                const errorMessage = this.translateService.instant(error.errorMessage);
                control.setErrors({
                    fluentValidation: {
                        message: errorMessage,
                        value: error.attemptedValue
                    }
                });
            }
        });
    }

    private getFormControl(propertyPath: string): AbstractControl | null {
        const pathParts = propertyPath.split('.');
        let control: AbstractControl = this.checkoutForm;

        for (const part of pathParts) {
            control = control.get(part);
            if (!control) break;
        }

        return control;
    }

    private clearFormErrors(): void {
        Object.keys(this.checkoutForm.controls).forEach(key => {
            const control = this.checkoutForm.get(key);
            if (control?.errors?.['fluentValidation']) {
                delete control.errors['fluentValidation'];
                if (Object.keys(control.errors).length === 0) {
                    control.setErrors(null);
                }
            }
        });
    }
}
```

### Template Integration

```html
<form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
  <!-- Customer Information -->
  <div class="form-section">
    <h3>{{ 'Checkout.CustomerInfo' | translate }}</h3>
    
    <div formGroupName="customer" class="form-group">
      <div class="field">
        <p-floatLabel>
          <input 
            pInputText 
            formControlName="firstName"
            [class.ng-invalid]="isFieldInvalid('customer.firstName')"
            id="firstName">
          <label for="firstName">{{ 'Checkout.FirstName' | translate }}</label>
        </p-floatLabel>
        
        <small 
          *ngIf="isFieldInvalid('customer.firstName')" 
          class="p-error">
          {{ getFieldError('customer.firstName') }}
        </small>
      </div>

      <div class="field">
        <p-floatLabel>
          <input 
            pInputText 
            formControlName="lastName"
            [class.ng-invalid]="isFieldInvalid('customer.lastName')"
            id="lastName">
          <label for="lastName">{{ 'Checkout.LastName' | translate }}</label>
        </p-floatLabel>
        
        <small 
          *ngIf="isFieldInvalid('customer.lastName')" 
          class="p-error">
          {{ getFieldError('customer.lastName') }}
        </small>
      </div>

      <div class="field">
        <p-floatLabel>
          <input 
            pInputText 
            formControlName="email"
            [class.ng-invalid]="isFieldInvalid('customer.email')"
            id="email">
          <label for="email">{{ 'Checkout.Email' | translate }}</label>
        </p-floatLabel>
        
        <small 
          *ngIf="isFieldInvalid('customer.email')" 
          class="p-error">
          {{ getFieldError('customer.email') }}
        </small>
      </div>
    </div>
  </div>

  <!-- Submit Button -->
  <div class="form-actions">
    <button 
      type="submit"
      class="p-button p-button-primary"
      [disabled]="checkoutForm.invalid || isProcessing">
      {{ 'Checkout.PlaceOrder' | translate }}
    </button>
  </div>
</form>
```

### Error Display Helper Methods

```typescript
export class CheckoutComponent {
    isFieldInvalid(fieldPath: string): boolean {
        const control = this.checkoutForm.get(fieldPath);
        return !!(control?.invalid && (control?.dirty || control?.touched));
    }

    getFieldError(fieldPath: string): string {
        const control = this.checkoutForm.get(fieldPath);
        
        if (control?.errors?.['fluentValidation']) {
            return control.errors['fluentValidation'].message;
        }
        
        // Fallback to Angular validator errors
        if (control?.errors?.['required']) {
            return this.translateService.instant('Validation.Required');
        }
        
        if (control?.errors?.['email']) {
            return this.translateService.instant('Validation.EmailFormat');
        }
        
        return '';
    }
}
```

## 🌐 Internationalization

### Error Message Keys

All validation error messages use i18n keys for multi-language support:

```json
{
  "Validation": {
    "FirstNameRequired": "First name is required",
    "FirstNameMinLength": "First name must be at least 2 characters",
    "FirstNameWhitespace": "First name cannot be only whitespace",
    "LastNameRequired": "Last name is required",
    "LastNameMinLength": "Last name must be at least 2 characters",
    "LastNameWhitespace": "Last name cannot be only whitespace",
    "EmailRequired": "Email address is required",
    "EmailFormat": "Please enter a valid email address",
    "EmailDomain": "Please enter a valid email domain",
    "StreetRequired": "Street address is required",
    "StreetMinLength": "Street address must be at least 5 characters",
    "StreetWhitespace": "Street address cannot be only whitespace",
    "CityRequired": "City is required",
    "CityMinLength": "City must be at least 2 characters",
    "CityFormat": "City name contains invalid characters",
    "StateRequired": "State/Province is required",
    "StateInvalid": "Please select a valid state/province",
    "CountryRequired": "Country is required",
    "CountryInvalid": "Please select a valid country",
    "ZipCodeRequired": "ZIP/Postal code is required",
    "ZipCodeFormat": "Please enter a valid ZIP/Postal code",
    "CardTypeRequired": "Card type is required",
    "CardTypeInvalid": "Please select a valid card type",
    "NameOnCardRequired": "Name on card is required",
    "NameOnCardMinLength": "Name on card must be at least 2 characters",
    "NameOnCardFormat": "Name on card contains invalid characters",
    "CardNumberRequired": "Card number is required",
    "CardNumberInvalid": "Please enter a valid card number",
    "SecurityCodeRequired": "Security code is required",
    "SecurityCodeInvalid": "Security code must be 3 or 4 digits",
    "ExpirationMonthRequired": "Expiration month is required",
    "ExpirationMonthInvalid": "Please select a valid month (1-12)",
    "ExpirationYearRequired": "Expiration year is required",
    "ExpirationYearInvalid": "Please select a valid year",
    "BillingAddressRequired": "Billing address is required when different from shipping"
  }
}
```

## 🧪 Testing Validators

### Unit Testing

```typescript
describe('CustomerValidator', () => {
    let validator: CustomerValidator;

    beforeEach(() => {
        validator = new CustomerValidator();
    });

    describe('firstName validation', () => {
        it('should require firstName', () => {
            const customer: CustomerData = {
                firstName: '',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            const result = validator.validate(customer);

            expect(result.isValid).toBeFalse();
            expect(result.errors).toContain(
                jasmine.objectContaining({
                    propertyName: 'firstName',
                    errorMessage: 'Validation.FirstNameRequired'
                })
            );
        });

        it('should require minimum length', () => {
            const customer: CustomerData = {
                firstName: 'J',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            const result = validator.validate(customer);

            expect(result.isValid).toBeFalse();
            expect(result.errors).toContain(
                jasmine.objectContaining({
                    propertyName: 'firstName',
                    errorMessage: 'Validation.FirstNameMinLength'
                })
            );
        });

        it('should reject whitespace-only names', () => {
            const customer: CustomerData = {
                firstName: '   ',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            const result = validator.validate(customer);

            expect(result.isValid).toBeFalse();
            expect(result.errors).toContain(
                jasmine.objectContaining({
                    propertyName: 'firstName',
                    errorMessage: 'Validation.FirstNameWhitespace'
                })
            );
        });

        it('should accept valid firstName', () => {
            const customer: CustomerData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            const result = validator.validate(customer);
            const firstNameErrors = result.errors.filter(e => e.propertyName === 'firstName');

            expect(firstNameErrors).toHaveLength(0);
        });
    });

    describe('email validation', () => {
        it('should validate email format', () => {
            const customer: CustomerData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email'
            };

            const result = validator.validate(customer);

            expect(result.isValid).toBeFalse();
            expect(result.errors).toContain(
                jasmine.objectContaining({
                    propertyName: 'email',
                    errorMessage: 'Validation.EmailFormat'
                })
            );
        });

        it('should validate email domain', () => {
            const customer: CustomerData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@invalid'
            };

            const result = validator.validate(customer);

            expect(result.isValid).toBeFalse();
            expect(result.errors).toContain(
                jasmine.objectContaining({
                    propertyName: 'email',
                    errorMessage: 'Validation.EmailDomain'
                })
            );
        });
    });
});
```

### Integration Testing

```typescript
describe('PaymentValidator Integration', () => {
    let validator: PaymentValidator;

    beforeEach(() => {
        validator = new PaymentValidator();
    });

    it('should validate complete payment info', () => {
        const paymentInfo: PaymentInfo = {
            cardType: 'Visa',
            nameOnCard: 'John Doe',
            cardNumber: '4111111111111111', // Valid test Visa number
            securityCode: '123',
            expirationMonth: '12',
            expirationYear: '2025'
        };

        const result = validator.validate(paymentInfo);

        expect(result.isValid).toBeTrue();
        expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid credit card number', () => {
        const paymentInfo: PaymentInfo = {
            cardType: 'Visa',
            nameOnCard: 'John Doe',
            cardNumber: '1234567890123456', // Invalid number
            securityCode: '123',
            expirationMonth: '12',
            expirationYear: '2025'
        };

        const result = validator.validate(paymentInfo);

        expect(result.isValid).toBeFalse();
        expect(result.errors).toContain(
            jasmine.objectContaining({
                propertyName: 'cardNumber',
                errorMessage: 'Validation.CardNumberInvalid'
            })
        );
    });
});
```

## 🔗 Custom Validation Rules

### Creating Custom Validators

```typescript
export class ProductValidator extends Validator<Product> {
    constructor() {
        super();

        this.ruleFor('name')
            .notEmpty()
            .withMessage('Validation.ProductNameRequired')
            .must(this.isUniqueProductName)
            .withMessage('Validation.ProductNameExists');

        this.ruleFor('price')
            .greaterThan(0)
            .withMessage('Validation.PriceMustBePositive')
            .must(this.isReasonablePrice)
            .withMessage('Validation.PriceUnreasonable');

        this.ruleFor('category')
            .must(this.isValidCategory)
            .withMessage('Validation.CategoryInvalid');
    }

    private isUniqueProductName = async (name: string): Promise<boolean> => {
        // Async validation example
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate API call to check uniqueness
                resolve(!['existing-product'].includes(name.toLowerCase()));
            }, 100);
        });
    };

    private isReasonablePrice = (price: number): boolean => {
        return price >= 0.01 && price <= 10000;
    };

    private isValidCategory = (categoryId: string): boolean => {
        const validCategories = ['books', 'electronics', 'clothing'];
        return validCategories.includes(categoryId);
    };
}
```

### Conditional Validation

```typescript
export class UserProfileValidator extends Validator<UserProfile> {
    constructor() {
        super();

        this.ruleFor('companyName')
            .notEmpty()
            .withMessage('Validation.CompanyNameRequired')
            .when(user => user.accountType === 'business');

        this.ruleFor('taxId')
            .notEmpty()
            .withMessage('Validation.TaxIdRequired')
            .matches(/^\d{2}-\d{7}$/)
            .withMessage('Validation.TaxIdFormat')
            .when(user => user.accountType === 'business');

        this.ruleFor('dateOfBirth')
            .notEmpty()
            .withMessage('Validation.DateOfBirthRequired')
            .must(this.isAdult)
            .withMessage('Validation.MustBeAdult')
            .when(user => user.accountType === 'personal');
    }

    private isAdult = (birthDate: Date): boolean => {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
        }
        
        return age >= 18;
    };
}
```

## 🔗 Related Documentation

- [Services Documentation](../services/README.md) - FluentValidationService
- [Components Documentation](../components/README.md) - Form integration
- [Models Documentation](../models/README.md) - Data interfaces
- [FluentValidation-TS Documentation](https://github.com/AlexJPotter/fluentvalidation-ts)

## 📝 Best Practices

- **Separate Concerns** - Keep validation logic separate from components
- **Use i18n Keys** - Always use translatable error message keys
- **Test Thoroughly** - Write comprehensive unit tests for validators
- **Compose Validators** - Break complex validation into smaller validators
- **Handle Async Validation** - Use promises for server-side validation
- **Provide Clear Messages** - Write user-friendly error messages
- **Validate Early** - Implement real-time validation feedback
- **Consider UX** - Balance validation strictness with user experience
