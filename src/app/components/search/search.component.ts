import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.css',
    imports: [IconFieldModule, InputIconModule, InputTextModule, TranslateModule],
})
export class SearchComponent {
    @ViewChild('myInput') searchInput!: ElementRef<HTMLInputElement>;

    constructor(private router: Router) {}

    ngOnInit(): void {}

    doSearch(value: string): void {
        // Trim whitespace and check if the search term is not empty
        const trimmedValue = value?.trim();

        if (trimmedValue && trimmedValue.length > 0) {
            this.router.navigateByUrl(`/search/${encodeURIComponent(trimmedValue)}`);
        } else {
            // If search is empty, navigate to all products and clear the input
            this.router.navigateByUrl('/products');
            if (this.searchInput) {
                this.searchInput.nativeElement.value = '';
            }
        }
    }
}
