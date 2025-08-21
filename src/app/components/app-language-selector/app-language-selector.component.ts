import { LanguageFacade } from '@/facades/language.facade';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { Language } from '../../models/language';

@Component({
    selector: 'app-language-selector',
    standalone: true,
    imports: [CommonModule, SelectModule, FormsModule, TranslateModule],
    templateUrl: './app-language-selector.component.html',
    styleUrls: ['./app-language-selector.component.scss'],
})
export class AppLanguageSelectorComponent implements OnInit, OnDestroy {
    languages: Language[] = [];
    selectedLanguage: string = '';
    private destroy$ = new Subject<void>();

    constructor(private languageFacade: LanguageFacade) {}

    ngOnInit() {
        this.languageFacade.loadLanguageFromStorage();

        this.languageFacade.availableLanguages$.pipe(takeUntil(this.destroy$)).subscribe((languages: Language[]) => {
            this.languages = languages;
        });

        this.languageFacade.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe((language: string) => {
            this.selectedLanguage = language;
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onLanguageChange(languageCode: string) {
        this.languageFacade.setLanguage(languageCode);
    }

    getSelectedLanguageCountryCode(): string {
        const language = this.languages.find(lang => lang.code === this.selectedLanguage);

        return language ? language.countryCode : '';
    }

    getSelectedLanguageName(): string {
        const language = this.languages.find(lang => lang.code === this.selectedLanguage);

        return language ? language.name : '';
    }
}
