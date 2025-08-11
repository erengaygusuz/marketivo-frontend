import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CartStatusComponent } from "@/components/cart-status/cart-status.component";
import { LoginStatusComponent } from "@/components/login-status/login-status.component";
import { LanguageSelectorComponent } from "@/components/language-selector/language-selector.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, IconFieldModule, InputIconModule, InputTextModule, BadgeModule, OverlayBadgeModule, CartStatusComponent, LoginStatusComponent, LanguageSelectorComponent, TranslateModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo hidden md:flex" routerLink="/">
                <img src="images/logo.png" alt="Logo" class="h-12 w-auto" />
            </a>
        </div>

        <p-iconfield iconPosition="left" class="flex-1 mx-4 hidden md:flex">
            <input #searchInput pInputText type="text" [placeholder]="'Search.Placeholder' | translate" class="w-full" (keyup.enter)="doSearch(searchInput.value)" />
            <p-inputicon class="pi pi-search" (click)="doSearch(searchInput.value)" />
        </p-iconfield>

        <div class="layout-topbar-actions">

            <!-- Dark Mode Toggle - Always visible -->
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
            </div>

            <!-- Cart Status - Always visible -->
            <button type="button" class="layout-topbar-action">
                <a routerLink="/cart-details" class="flex items-center">
                    <app-cart-status></app-cart-status>
                </a>
            </button>

            <!-- Mobile Menu Button -->
            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <!-- Mobile Menu Content - Only Language and Login -->
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <div class="flex align-items-center mb-2 lg:mb-0" style="min-width: 14rem;">
                        <app-language-selector></app-language-selector>
                    </div>
                    <app-login-status></app-login-status>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService, private router: Router) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    doSearch(value: string): void {
        if (value && value.trim()) {
            this.router.navigateByUrl(`/search/${value.trim()}`);
        }
    }
}
