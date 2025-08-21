import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AuthFacade } from '../../facades/auth.facade';

@Component({
    selector: 'app-auth-callback',
    template: '',
})
export class AppAuthCallbackComponent implements OnInit {
    constructor(
        public auth: AuthService,
        private authFacade: AuthFacade
    ) {}

    ngOnInit() {
        this.authFacade.initializeAuth();
    }
}
