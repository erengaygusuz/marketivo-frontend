import { AuthFacade } from '@/facades/auth.facade';
import { LanguageFacade } from '@/facades/language.facade';
import { CartService } from '@/services/cart.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, TranslateModule],
    template: `
        <p-toast position="top-right"></p-toast>
        <router-outlet></router-outlet>
    `,
})
export class AppComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private translate: TranslateService,
        private cartService: CartService,
        private languageFacade: LanguageFacade,
        private authFacade: AuthFacade
    ) {}

    ngOnInit() {
        // Initialize authentication state
        this.authFacade.initializeAuth();

        // Initialize cart from localStorage
        this.cartService.initializeCart();

        // Load language from storage
        this.languageFacade.loadLanguageFromStorage();

        // Subscribe to language changes
        this.languageFacade.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe((language: string) => {
            this.translate.use(language);
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
