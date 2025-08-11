import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class LoginStatusComponent {
  isAuthenticated: boolean = false;
  profileJson: string | undefined;
  userDisplayName: string | undefined;
  storage: Storage = sessionStorage;

  constructor(
    private auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((authenticated: boolean) => {
      this.isAuthenticated = authenticated;
      console.log('User is authenticated: ', this.isAuthenticated);
    });
    this.auth.user$.subscribe((user) => {
      // Prefer 'name', fallback to 'nickname', fallback to email
      this.userDisplayName = user?.name || user?.nickname || user?.email;
      this.storage.setItem('userDisplayName', JSON.stringify(this.userDisplayName));
      
      // Store user email for order history and checkout
      if (user?.email) {
        this.storage.setItem('userEmail', JSON.stringify(user.email));
      }
    });
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    // Clear stored user data
    this.storage.removeItem('userEmail');
    this.storage.removeItem('userDisplayName');
    
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
  }
}
