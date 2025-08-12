import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../app-menuitem';
import { ProductService } from '@/services/product.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, TranslateModule],
    templateUrl: './app-menu.component.html',
    styleUrl: './app-menu.component.css'
})
export class AppMenu implements OnDestroy {
    model: MenuItem[] = [
        {
            items: []
        }
    ];
    isLoading: boolean = true;
    errorMessage: string = '';
    private langChangeSubscription: Subscription | null = null;

    constructor(
        private productService: ProductService,
        private translate: TranslateService
    ) {}

    ngOnInit() {
        this.listProductCategories();
        
        // Subscribe to language changes to update the Categories label
        this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
            this.updateCategoriesLabel();
        });
    }

    ngOnDestroy() {
        if (this.langChangeSubscription) {
            this.langChangeSubscription.unsubscribe();
        }
    }

    private updateCategoriesLabel(): void {
        if (this.model[0]) {
            this.model[0].label = this.translate.instant('Navigation.Categories');
        }
    }

    listProductCategories(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.productService.getProductCategories().subscribe({
            next: (data) => {
                this.model[0].label = this.translate.instant('Navigation.Categories');
                this.model[0].items = data.map((category) => ({
                    label: category.categoryName,
                    routerLink: [`/category/${category.id}`]
                }));
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = this.translate.instant('Navigation.FailedToLoadCategories');
                this.model[0].items = [];
                this.isLoading = false;
            }
        });
    }
}
