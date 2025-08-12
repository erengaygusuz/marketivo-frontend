import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction('[Language] Set Language', props<{ language: string }>());

export const loadLanguageFromStorage = createAction('[Language] Load Language From Storage');

export const languageLoaded = createAction('[Language] Language Loaded', props<{ language: string }>());
