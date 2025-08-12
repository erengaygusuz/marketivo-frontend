# Language Management with NgRx

## Overview
The language management system has been migrated from a simple service-based approach to NgRx for better state management and predictable data flow.

## Architecture

### State Structure
- **Current Language**: Stores the currently selected language code (e.g., 'en-US', 'tr-TR')
- **Available Languages**: List of supported languages with their details
- **Loading**: Indicates if language operations are in progress

### Store Components

#### Actions (`language.actions.ts`)
- `setLanguage`: Changes the current language
- `loadLanguageFromStorage`: Loads language preference from localStorage
- `languageLoaded`: Triggered when language is loaded from storage

#### State (`language.state.ts`)
- Defines the `LanguageState` interface
- Contains initial state with default language and available languages

#### Reducer (`language.reducer.ts`)
- Handles state transitions based on dispatched actions
- Updates current language and loading states

#### Effects (`language.effects.ts`)
- Handles side effects like localStorage operations
- Updates TranslateService when language changes
- Loads language from localStorage on app initialization

#### Selectors (`language.selectors.ts`)
- `selectCurrentLanguage`: Gets current language code
- `selectAvailableLanguages`: Gets list of supported languages
- `selectCurrentLanguageDetails`: Gets details of current language
- `selectLanguageLoading`: Gets loading state

### Facade Service (`language.facade.ts`)
A facade service provides a clean API for components to interact with the language store without directly using NgRx actions and selectors.

## Usage

### In Components
```typescript
// Inject the facade service
constructor(private languageFacade: LanguageFacade) {}

// Subscribe to current language
this.languageFacade.currentLanguage$.subscribe(language => {
  // Handle language change
});

// Change language
this.languageFacade.setLanguage('tr-TR');
```

### Available Languages
The system currently supports:
- English (en-US) - Default
- Turkish (tr-TR)

## Migration Benefits
1. **Centralized State**: All language state is managed in one place
2. **Predictable Updates**: State changes follow Redux patterns
3. **Time Travel Debugging**: Redux DevTools support
4. **Side Effect Management**: Effects handle localStorage and translation service updates
5. **Type Safety**: Full TypeScript support with typed actions and state

## Files Modified/Created
- `src/app/store/language/` - Complete NgRx language store
- `src/app/services/language.facade.ts` - Facade service
- `src/app/components/language-selector/language-selector.component.ts` - Updated to use NgRx
- `src/app.component.ts` - Updated to use NgRx
- `src/app.config.ts` - Added LanguageEffects
- `src/app/store/` - Updated root state and reducer
