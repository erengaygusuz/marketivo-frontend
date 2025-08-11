import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-members-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TranslateModule],
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.css'
})
export class MembersPageComponent {

}
