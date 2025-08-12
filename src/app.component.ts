import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@/services/language.service';
import { CartService } from '@/services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import myAppConfig from '@/config/my-app-config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, TranslateModule],
    providers: [MessageService],
    template: `
        <p-toast position="top-right"></p-toast>
        <router-outlet></router-outlet>
    `
})
export class AppComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private translate: TranslateService,
        private languageService: LanguageService,
        private cartService: CartService
    ) {
        // Initialize language service
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', myAppConfig.i18n.defaultLanguage);
        }
    }

    ngOnInit() {
        // Initialize cart from localStorage
        this.cartService.initializeCart();
        
        this.languageService
            .getLanguage()
            .pipe(takeUntil(this.destroy$))
            .subscribe(language => {
                this.translate.use(language);
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
