import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@/services/language.service';
import { Subject, takeUntil } from 'rxjs';
import myAppConfig from '@/config/my-app-config';

interface Language {
  name: string;
  code: string;
  countryCode: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, SelectModule, FormsModule, TranslateModule],
  template: `
    <p-select
      [options]="languages"
      [(ngModel)]="selectedLanguage"
      optionLabel="name"
      optionValue="code"
      [placeholder]="'Components.LanguageSelector.SelectLanguage' | translate"
      (onChange)="onLanguageChange($event.value)"
      styleClass="w-full"
      [style]="{ 'min-width': '200px' }">
      
      <ng-template pTemplate="selectedItem">
        <div class="flex align-items-center gap-2" *ngIf="selectedLanguage">
          <span [class]="'fi fi-' + getSelectedLanguageCountryCode()" 
                [title]="'Flag: ' + getSelectedLanguageCountryCode()"></span>
          <span>{{ getSelectedLanguageName() }}</span>
        </div>
      </ng-template>
      
      <ng-template let-language pTemplate="item">
        <div class="flex align-items-center gap-2">
          <span [class]="'fi fi-' + language.countryCode" 
                [title]="'Flag: ' + language.countryCode"></span>
          <span>{{ language.name }}</span>
        </div>
      </ng-template>
    </p-select>
  `,
  styles: [`
    .fi {
      width: 20px;
      height: 15px;
      display: inline-block;
      margin-right: 8px;
      background-size: cover;
      background-position: center;
      border-radius: 2px;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  languages: Language[] = [];
  selectedLanguage: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.initializeLanguages();
  }

  ngOnInit() {
    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        this.selectedLanguage = language;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeLanguages() {
    this.languages = [
      {
        name: 'English',
        code: 'en-US',
        countryCode: 'us'
      },
      {
        name: 'Türkçe',
        code: 'tr-TR', 
        countryCode: 'tr'
      }
    ];
  }

  onLanguageChange(languageCode: string) {
    this.translate.use(languageCode);
    localStorage.setItem('language', languageCode);
    this.languageService.setLanguage(languageCode);
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
