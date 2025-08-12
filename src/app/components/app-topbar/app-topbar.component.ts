import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../services/layout.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CartStatusComponent } from '@/components/cart-status/cart-status.component';
import { LoginStatusComponent } from '@/components/login-status/login-status.component';
import { LanguageSelectorComponent } from '@/components/language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';

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
        CartStatusComponent,
        LoginStatusComponent,
        LanguageSelectorComponent,
        TranslateModule,
    ],
    templateUrl: './app-topbar.component.html',
    styleUrl: './app-topbar.component.css',
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(
        public layoutService: LayoutService,
        private router: Router
    ) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update(state => ({ ...state, darkTheme: !state.darkTheme }));
    }

    doSearch(value: string): void {
        if (value && value.trim()) {
            this.router.navigateByUrl(`/search/${value.trim()}`);
        }
    }
}
