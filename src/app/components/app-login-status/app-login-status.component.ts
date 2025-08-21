import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../facades/auth.facade';

@Component({
    selector: 'app-login-status',
    templateUrl: './app-login-status.component.html',
    styleUrls: ['./app-login-status.component.scss'],
    imports: [CommonModule, RouterModule, TranslateModule],
})
export class AppLoginStatusComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean = false;
    userDisplayName: string | undefined;
    private subscriptions: Subscription = new Subscription();

    constructor(private authFacade: AuthFacade) {}

    ngOnInit(): void {
        this.authFacade.initializeAuth();

        this.subscriptions.add(
            this.authFacade.isAuthenticated$.subscribe((authenticated: boolean) => {
                this.isAuthenticated = authenticated;
            })
        );

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
