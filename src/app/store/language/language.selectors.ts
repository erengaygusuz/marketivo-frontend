import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LanguageState, Language } from './language.state';

export const selectLanguageState = createFeatureSelector<LanguageState>('language');

export const selectCurrentLanguage = createSelector(
  selectLanguageState,
  (state: LanguageState) => state.currentLanguage
);

export const selectAvailableLanguages = createSelector(
  selectLanguageState,
  (state: LanguageState) => state.availableLanguages
);

export const selectCurrentLanguageDetails = createSelector(
  selectLanguageState,
  (state: LanguageState) => {
    return state.availableLanguages.find(lang => lang.code === state.currentLanguage);
  }
);

export const selectLanguageLoading = createSelector(
  selectLanguageState,
  (state: LanguageState) => state.loading
);
