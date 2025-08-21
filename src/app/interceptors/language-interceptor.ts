import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import { selectCurrentLanguage } from '../store/language/language.selectors';

export const LanguageInterceptor: HttpInterceptorFn = (req, next) => {
    const store = inject(Store<AppState>);

    return from(
        store.select(selectCurrentLanguage).pipe(
            take(1),
            switchMap(currentLanguage => {
                const langReq = req.clone({
                    setHeaders: {
                        'Accept-Language': currentLanguage || 'en-US',
                    },
                });

                return next(langReq);
            })
        )
    );
};
