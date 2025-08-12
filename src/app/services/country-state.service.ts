import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetResponseCountries } from '../common/interfaces/GetResponseCountries';
import { GetResponseStates } from '../common/interfaces/GetResponseStates';
import { Country } from '../common/models/country';
import { State } from '../common/models/state';

@Injectable({
    providedIn: 'root',
})
export class CountryStateService {
    private countriesUrl = `${environment.apiBaseUrl}/countries`;
    private statesUrl = `${environment.apiBaseUrl}/states`;

    constructor(private http: HttpClient) {}

    getCountries(): Observable<Country[]> {
        return this.http
            .get<GetResponseCountries>(this.countriesUrl)
            .pipe(map(response => response._embedded.countries));
    }

    getStates(theCountryCode: string): Observable<State[]> {
        const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

        return this.http.get<GetResponseStates>(searchStatesUrl).pipe(map(response => response._embedded.states));
    }

    getCreditCardMonths(startMonth: number): Observable<number[]> {
        const months: number[] = [];

        for (let month = startMonth; month <= 12; month++) {
            months.push(month);
        }

        return of(months);
    }

    getCreditCardYears(): Observable<number[]> {
        const data: number[] = [];

        const startYear: number = new Date().getFullYear();
        const endYear: number = startYear + 10;

        for (let theYear = startYear; theYear <= endYear; theYear++) {
            data.push(theYear);
        }

        return of(data);
    }
}
