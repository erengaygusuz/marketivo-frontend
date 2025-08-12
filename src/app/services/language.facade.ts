import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '@/store/app.state';
import { Language } from '@/store/language/language.state';
import {
    selectCurrentLanguage,
    selectAvailableLanguages,
    selectCurrentLanguageDetails,
    selectLanguageLoading,
} from '@/store/language/language.selectors';
import { setLanguage, loadLanguageFromStorage } from '@/store/language/language.actions';

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
