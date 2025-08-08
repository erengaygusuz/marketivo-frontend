import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-callback',
  template: `
  `
})
export class AuthCallbackComponent {
  constructor(public auth: AuthService) {}
}
