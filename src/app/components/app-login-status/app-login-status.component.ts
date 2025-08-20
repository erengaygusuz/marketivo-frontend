import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../facades/auth.facade';

@Component({
    selector: 'app-login-status',
    templateUrl: './app-login-status.component.html',
    styleUrls: ['./app-login-status.component.css'],
    imports: [CommonModule, RouterModule, TranslateModule],
})
export class AppLoginStatusComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean = false;
    userDisplayName: string | undefined;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private authFacade: AuthFacade,
        @Inject(DOCUMENT) private doc: Document
    ) {}

    ngOnInit(): void {
        // Initialize auth state in NgRx store
        this.authFacade.initializeAuth();

        // Subscribe to authentication state from NgRx store
        this.subscriptions.add(
            this.authFacade.isAuthenticated$.subscribe((authenticated: boolean) => {
                this.isAuthenticated = authenticated;
            })
        );

        // Subscribe to user display name from NgRx store
        this.subscriptions.add(
            this.authFacade.userName$.subscribe(displayName => {
                this.userDisplayName = displayName || undefined;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    login() {
        this.authFacade.login();
    }

    logout(): void {
        this.authFacade.logout();
    }
}
