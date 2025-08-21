import { Validator } from 'fluentvalidation-ts';
import { AddressData } from '../models/address-data';
import { CheckoutFormData } from '../models/checkout-form-data';
import { Country } from '../models/country';
import { CustomerData } from '../models/customer-data';
import { State } from '../models/state';

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
            .withMessage('Validation.EmailInvalid')
            .must(this.notOnlyWhitespace)
            .withMessage('Validation.EmailWhitespace');
    }

    private notOnlyWhitespace = (value: string): boolean => !!value && value.trim().length > 0;
}

export class AddressValidator extends Validator<AddressData> {
    constructor() {
        super();

        this.ruleFor('street')
            .notEmpty()
            .withMessage('Validation.StreetRequired')
            .minLength(2)
            .withMessage('Validation.StreetMinLength')
            .must(this.notOnlyWhitespace)
            .withMessage('Validation.StreetWhitespace');

        this.ruleFor('city')
            .notEmpty()
            .withMessage('Validation.CityRequired')
            .minLength(2)
            .withMessage('Validation.CityMinLength')
            .must(this.notOnlyWhitespace)
            .withMessage('Validation.CityWhitespace');

        this.ruleFor('state').must(this.isValidSelection).withMessage('Validation.StateRequired');

        this.ruleFor('country').must(this.isValidSelection).withMessage('Validation.CountryRequired');

        this.ruleFor('zipCode')
            .notEmpty()
            .withMessage('Validation.ZipCodeRequired')
            .minLength(2)
            .withMessage('Validation.ZipCodeMinLength')
            .must(this.notOnlyWhitespace)
            .withMessage('Validation.ZipCodeWhitespace');
    }

    private notOnlyWhitespace = (value: string): boolean => !!value && value.trim().length > 0;

    private isValidSelection = (value: State | Country | null | undefined): boolean => {
        if (value === null || value === undefined) {
            return false;
        }
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            return false;
        }

        return true;
    };
}

export class CheckoutFormValidator extends Validator<CheckoutFormData> {
    constructor() {
        super();

        this.ruleFor('customer').setValidator(() => new CustomerValidator());

        this.ruleFor('shippingAddress').setValidator(() => new AddressValidator());

        this.ruleFor('billingAddress').setValidator(() => new AddressValidator());
    }
}
