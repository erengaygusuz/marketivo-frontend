import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.html',
  styleUrl: './login-status.css',
  standalone: false
})
export class LoginStatus {

  isAuthenticated: boolean = false;
  profileJson: string | undefined;
  userEmail: string | undefined;
  storage: Storage = sessionStorage;

  constructor(private auth: AuthService, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(
      (authenticated: boolean) => {
        this.isAuthenticated = authenticated;
        console.log('User is authenticated: ', this.isAuthenticated);
      }
    );
    this.auth.user$.subscribe(
      (user) => {
        this.userEmail = user?.email;
        this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
      }
    );
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin
      }
    });
  }

}