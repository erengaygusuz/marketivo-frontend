export interface Language {
  name: string;
  code: string;
  countryCode: string;
}

export interface LanguageState {
  currentLanguage: string;
  availableLanguages: Language[];
  loading: boolean;
}

export const initialLanguageState: LanguageState = {
  currentLanguage: 'en-US',
  availableLanguages: [
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
  ],
  loading: false
};
