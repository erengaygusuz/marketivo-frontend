import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    templateUrl: './app-footer.component.html',
    styleUrl: './app-footer.component.scss',
})
export class AppFooter {
    currentYear = new Date().getFullYear();
}
