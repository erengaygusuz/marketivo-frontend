import { AppState } from '@/store/app.state';
import { loadLanguageFromStorage, setLanguage } from '@/store/language/language.actions';
import {
    selectAvailableLanguages,
    selectCurrentLanguage,
    selectCurrentLanguageDetails,
    selectLanguageLoading,
} from '@/store/language/language.selectors';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Language } from '../models/language';

@Injectable({
    providedIn: 'root',
})
export class LanguageFacade {
    constructor(private store: Store<AppState>) {}

    // Selectors
    get currentLanguage$(): Observable<string> {
        return this.store.select(selectCurrentLanguage);
    }

    get availableLanguages$(): Observable<Language[]> {
        return this.store.select(selectAvailableLanguages);
    }

    get currentLanguageDetails$(): Observable<Language | undefined> {
        return this.store.select(selectCurrentLanguageDetails);
    }

    get loading$(): Observable<boolean> {
        return this.store.select(selectLanguageLoading);
    }

    // Actions
    setLanguage(language: string): void {
        this.store.dispatch(setLanguage({ language }));
    }

    loadLanguageFromStorage(): void {
        this.store.dispatch(loadLanguageFromStorage());
    }

    // Helper methods
    getCurrentLanguage(): Observable<string> {
        return this.currentLanguage$;
    }

    getAvailableLanguages(): Observable<Language[]> {
        return this.availableLanguages$;
    }
}
