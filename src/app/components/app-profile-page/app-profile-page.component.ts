import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../facades/auth.facade';
import { User } from '../../models/user';
import { UserDisplayData } from '../../models/user-display-data';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [CommonModule, CardModule, DividerModule, ButtonModule, TableModule, TranslateModule],
    templateUrl: './app-profile-page.component.html',
    styleUrls: ['./app-profile-page.component.scss'],
})
export class AppProfilePageComponent implements OnInit, OnDestroy {
    user: UserDisplayData | null = null;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private authFacade: AuthFacade,
        private translate: TranslateService
    ) {}

    ngOnInit() {
        this.subscriptions.add(
            this.authFacade.user$.subscribe(user => {
                if (user) {
                    this.updateUserData(user);
                }
            })
        );

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

    private updateUserData(user: User): void {
        this.user = {
            name: user.name || user.nickname || this.translate.instant('Profile.UnknownUser'),
            email: user.email || this.translate.instant('Profile.NoEmailProvided'),
            username: user.nickname || user['preferred_username'] || this.translate.instant('Profile.NotAvailable'),
            phone: user['phone_number'] || this.translate.instant('Profile.NoPhoneProvided'),
            address: user['address'] || this.translate.instant('Profile.NoAddressProvided'),
            memberSince:
                user['created_at'] && typeof user['created_at'] === 'string'
                    ? new Date(user['created_at'])
                    : new Date(),
            photoUrl: user.picture || 'assets/images/profile-placeholder.png',
        };
    }
}
