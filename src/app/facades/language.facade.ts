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
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Language } from '../models/language';

@Injectable({
    providedIn: 'root',
})
export class LanguageFacade {
    constructor(
        private store: Store<AppState>,
        private translateService: TranslateService
    ) {}

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

    setLanguage(language: string): void {
        this.store.dispatch(setLanguage({ language }));
    }

    loadLanguageFromStorage(): void {
        this.store.dispatch(loadLanguageFromStorage());
    }

    getCurrentLanguage(): Observable<string> {
        return this.currentLanguage$;
    }

    getAvailableLanguages(): Observable<Language[]> {
        return this.availableLanguages$;
    }

    translate(key: string, params?: Record<string, string | number>): Observable<string> {
        return this.translateService.get(key, params);
    }

    translateInstant(key: string, params?: Record<string, string | number>): string {
        return this.translateService.instant(key, params);
    }

    translateMultiple(keys: string[], params?: Record<string, string | number>): Observable<Record<string, string>> {
        return this.translateService.get(keys, params);
    }

    translateMultipleInstant(keys: string[], params?: Record<string, string | number>): Record<string, string> {
        return this.translateService.instant(keys, params);
    }

    translateStream(key: string, params?: Record<string, string | number>): Observable<string> {
        return this.translateService.stream(key, params);
    }

    hasTranslation(key: string): boolean {
        return this.translateService.instant(key) !== key;
    }

    setLanguageAndTranslate(language: string): void {
        this.setLanguage(language);
        this.translateService.use(language);
    }
}
