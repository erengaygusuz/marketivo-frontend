import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Country } from '../models/country';
import { GetResponseCountry } from '../models/get-response-country';
import { GetResponseState } from '../models/get-response-state';
import { State } from '../models/state';

@Injectable({
    providedIn: 'root',
})
export class CountryStateService {
    private countriesUrl = `${environment.apiBaseUrl}/countries`;
    private statesUrl = `${environment.apiBaseUrl}/states`;

    constructor(private http: HttpClient) {}

    getCountries(): Observable<Country[]> {
        return this.http.get<GetResponseCountry>(this.countriesUrl).pipe(map(response => response._embedded.countries));
    }

    getStates(theCountryCode: string): Observable<State[]> {
        const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

        return this.http.get<GetResponseState>(searchStatesUrl).pipe(map(response => response._embedded.states));
    }
}
