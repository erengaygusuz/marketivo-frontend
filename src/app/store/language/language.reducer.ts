import { createReducer, on } from '@ngrx/store';
import { initialLanguageState } from './language.state';
import * as LanguageActions from './language.actions';

export const languageReducer = createReducer(
  initialLanguageState,
  on(LanguageActions.setLanguage, (state, { language }) => ({
    ...state,
    currentLanguage: language
  })),
  on(LanguageActions.loadLanguageFromStorage, (state) => ({
    ...state,
    loading: true
  })),
  on(LanguageActions.languageLoaded, (state, { language }) => ({
    ...state,
    currentLanguage: language,
    loading: false
  }))
);
