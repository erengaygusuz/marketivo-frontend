import { Country } from './country';

export interface GetResponseCountry {
    _embedded: {
        countries: Country[];
    };
}
