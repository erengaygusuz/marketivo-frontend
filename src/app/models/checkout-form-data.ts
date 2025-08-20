import { Country } from './country';
import { State } from './state';

export interface CheckoutFormData {
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    };
    shippingAddress: {
        street: string;
        city: string;
        state: State;
        country: Country;
        zipCode: string;
    };
    billingAddress: {
        street: string;
        city: string;
        state: State;
        country: Country;
        zipCode: string;
    };
}
