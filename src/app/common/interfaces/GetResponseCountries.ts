import { Country } from '../models/country';

export interface GetResponseCountries {
    _embedded: {
        countries: Country[];
    };
}
