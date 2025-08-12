import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CartService } from '@/services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { LanguageFacade } from '@/services/language.facade';
import { AuthFacade } from '@/services/auth.facade';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, TranslateModule],
    providers: [MessageService],
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
