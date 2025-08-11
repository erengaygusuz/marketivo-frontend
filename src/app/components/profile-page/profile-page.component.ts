import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AuthService } from '@auth0/auth0-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule, ButtonModule, TableModule, TranslateModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  user: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.user = {
          name: user.name || user.nickname || 'Unknown User',
          email: user.email || 'No email provided',
          username: user.nickname || user.preferred_username || 'N/A',
          phone: user.phone_number || 'No phone provided',
          address: user.address || 'No address provided',
          memberSince: user['created_at'] ? new Date(user['created_at']) : new Date(),
          photoUrl: user.picture || 'assets/images/profile-placeholder.png'
        };
      }
    });
  }
}
