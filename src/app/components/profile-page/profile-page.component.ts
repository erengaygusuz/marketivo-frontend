import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AuthService } from '@auth0/auth0-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../services/auth.facade';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule, ButtonModule, TableModule, TranslateModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  user: any = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private authFacade: AuthFacade,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // Subscribe to user data from NgRx store
    this.subscriptions.add(
      this.authFacade.user$.subscribe(user => {
        if (user) {
          this.updateUserData(user);
        }
      })
    );

    // Subscribe to language changes to update user data with new translations
    this.subscriptions.add(
      this.translate.onLangChange.subscribe(() => {
        this.authFacade.user$.subscribe(user => {
          if (user) {
            this.updateUserData(user);
          }
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private updateUserData(user: any): void {
    this.user = {
      name: user.name || user.nickname || this.translate.instant('Profile.UnknownUser'),
      email: user.email || this.translate.instant('Profile.NoEmailProvided'),
      username: user.nickname || user.preferred_username || this.translate.instant('Profile.NotAvailable'),
      phone: user.phone_number || this.translate.instant('Profile.NoPhoneProvided'),
      address: user.address || this.translate.instant('Profile.NoAddressProvided'),
      memberSince: user['created_at'] ? new Date(user['created_at']) : new Date(),
      photoUrl: user.picture || 'assets/images/profile-placeholder.png'
    };
  }
}
