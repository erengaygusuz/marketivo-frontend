import { Validator } from 'fluentvalidation-ts';

export interface CheckoutFormData {
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    };
    shippingAddress: {
        street: string;
        city: string;
        state: any;
        country: any;
        zipCode: string;
    };
    billingAddress: {
        street: string;
        city: string;
        state: any;
        country: any;
        zipCode: string;
    };
}

export interface CustomerData {
    firstName: string;
    lastName: string;
    email: string;
}

export interface AddressData {
    street: string;
    city: string;
    state: any;
    country: any;
    zipCode: string;
}

export class CustomerValidator extends Validator<CustomerData> {
    constructor() {
        super();

        this.ruleFor('firstName')
            .notEmpty()
            .withMessage('First name is required')
            .minLength(2)
            .withMessage('First name must be at least 2 characters')
            .must(this.notOnlyWhitespace)
            .withMessage('First name cannot contain only whitespace');

        this.ruleFor('lastName')
            .notEmpty()
            .withMessage('Last name is required')
            .minLength(2)
            .withMessage('Last name must be at least 2 characters')
            .must(this.notOnlyWhitespace)
            .withMessage('Last name cannot contain only whitespace');

        this.ruleFor('email')
            .notEmpty()
            .withMessage('Email is required')
            .emailAddress()
            .withMessage('Please enter a valid email address')
            .must(this.notOnlyWhitespace)
            .withMessage('Email cannot contain only whitespace');
    }

    private notOnlyWhitespace = (value: string): boolean => {
        return !!value && value.trim().length > 0;
    }
}

export class AddressValidator extends Validator<AddressData> {
    constructor() {
        super();

        this.ruleFor('street')
            .notEmpty()
            .withMessage('Street is required')
            .minLength(2)
            .withMessage('Street must be at least 2 characters')
            .must(this.notOnlyWhitespace)
            .withMessage('Street cannot contain only whitespace');

        this.ruleFor('city')
            .notEmpty()
            .withMessage('City is required')
            .minLength(2)
            .withMessage('City must be at least 2 characters')
            .must(this.notOnlyWhitespace)
            .withMessage('City cannot contain only whitespace');

        this.ruleFor('state')
            .must(this.isValidSelection)
            .withMessage('State is required');

        this.ruleFor('country')
            .must(this.isValidSelection)
            .withMessage('Country is required');

        this.ruleFor('zipCode')
            .notEmpty()
            .withMessage('Zip code is required')
            .minLength(2)
            .withMessage('Zip code must be at least 2 characters')
            .must(this.notOnlyWhitespace)
            .withMessage('Zip code cannot contain only whitespace');
    }

    private notOnlyWhitespace = (value: string): boolean => {
        return !!value && value.trim().length > 0;
    }

    private isValidSelection = (value: any): boolean => {
        // Handle null, undefined, empty string, and empty objects
        if (value === null || value === undefined || value === '') {
            return false;
        }
        // Check if it's an empty object
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            return false;
        }
        return true;
    }
}

export class CheckoutFormValidator extends Validator<CheckoutFormData> {
    constructor() {
        super();

        this.ruleFor('customer')
            .setValidator(() => new CustomerValidator());

        this.ruleFor('shippingAddress')
            .setValidator(() => new AddressValidator());

        this.ruleFor('billingAddress')
            .setValidator(() => new AddressValidator());
    }
}
