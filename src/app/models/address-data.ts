import { Country } from './country';
import { State } from './state';

export interface AddressData {
    street: string;
    city: string;
    state: State;
    country: Country;
    zipCode: string;
}
