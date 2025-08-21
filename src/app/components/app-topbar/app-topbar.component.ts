import { AppCartStatusComponent } from '@/components/app-cart-status/app-cart-status.component';
import { AppLanguageSelectorComponent } from '@/components/app-language-selector/app-language-selector.component';
import { AppLoginStatusComponent } from '@/components/app-login-status/app-login-status.component';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../services/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        BadgeModule,
        OverlayBadgeModule,
        AppCartStatusComponent,
        AppLoginStatusComponent,
        AppLanguageSelectorComponent,
        TranslateModule,
    ],
    templateUrl: './app-topbar.component.html',
    styleUrl: './app-topbar.component.scss',
})
export class AppTopbar {
    items!: MenuItem[];

    @ViewChild('myInput') searchInput!: ElementRef<HTMLInputElement>;

    constructor(
        public layoutService: LayoutService,
        private router: Router
    ) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update(state => ({ ...state, darkTheme: !state.darkTheme }));
    }

    doSearch(value: string): void {
        const trimmedValue = value?.trim();

        if (trimmedValue && trimmedValue.length > 0) {
            this.router.navigateByUrl(`/search/${encodeURIComponent(trimmedValue)}`);
        } else {
            this.router.navigateByUrl('/products');
            if (this.searchInput) {
                this.searchInput.nativeElement.value = '';
            }
        }
    }
}
