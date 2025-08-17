import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { map, tap } from 'rxjs/operators';
import * as LanguageActions from './language.actions';

@Injectable()
export class LanguageEffects {
    private actions$ = inject(Actions);
    private translate = inject(TranslateService);

    loadLanguageFromStorage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LanguageActions.loadLanguageFromStorage),
            map(() => {
                const storedLanguage = localStorage.getItem('language');
                const language = storedLanguage || 'en-US';

                return LanguageActions.languageLoaded({ language });
            })
        )
    );

    setLanguage$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LanguageActions.setLanguage, LanguageActions.languageLoaded),
                tap(({ language }) => {
                    localStorage.setItem('language', language);
                    this.translate.use(language);
                })
            ),
        { dispatch: false }
    );
}
