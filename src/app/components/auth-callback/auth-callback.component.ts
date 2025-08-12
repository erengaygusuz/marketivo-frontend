import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AuthFacade } from '../../services/auth.facade';

@Component({
    selector: 'app-auth-callback',
    template: `
        <div class="auth-callback">
            <p>Processing login...</p>
        </div>
    `,
})
export class AuthCallbackComponent implements OnInit {
    constructor(
        public auth: AuthService,
        private authFacade: AuthFacade
    ) {}

    ngOnInit() {
        // Initialize auth state to ensure NgRx store is updated after callback
        this.authFacade.initializeAuth();
    }
}
