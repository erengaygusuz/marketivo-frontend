import { ProductService } from '@/services/product.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppMenuitem } from '../app-menuitem/app-menuitem.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, TranslateModule],
    templateUrl: './app-menu.component.html',
    styleUrl: './app-menu.component.css',
})
export class AppMenu implements OnDestroy {
    model: MenuItem[] = [
        {
            label: '',
            items: [
                {
                    label: '',
                    icon: 'fas fa-home',
                    routerLink: ['/'],
                    styleClass: 'homepage-menu-item',
                },
            ],
        },
        {
            label: '',
            items: [],
        },
    ];
    isLoading: boolean = true;
    errorMessage: string = '';
    private langChangeSubscription: Subscription | null = null;

    constructor(
        private productService: ProductService,
        private translate: TranslateService
    ) {}

    ngOnInit() {
        this.initializeMenu();
        this.listProductCategories();

        // Subscribe to language changes to update the menu labels
        this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
            this.updateMenuLabels();
        });
    }

    ngOnDestroy() {
        if (this.langChangeSubscription) {
            this.langChangeSubscription.unsubscribe();
        }
    }

    private updateCategoriesLabel(): void {
        if (this.model[1]) {
            this.model[1].label = this.translate.instant('Navigation.Categories');
        }
    }

    private initializeMenu(): void {
        // Leave the first section label empty so it doesn't show a header
        this.model[0].label = '';
        this.model[0].items![0].label = this.translate.instant('Navigation.Homepage');
        this.model[1].label = this.translate.instant('Navigation.Categories');
    }

    private updateMenuLabels(): void {
        // Leave the first section label empty so it doesn't show a header
        this.model[0].label = '';
        this.model[0].items![0].label = this.translate.instant('Navigation.Homepage');
        this.updateCategoriesLabel();
    }

    listProductCategories(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.productService.getProductCategories().subscribe({
            next: data => {
                this.model[1].label = this.translate.instant('Navigation.Categories');
                this.model[1].items = data.map(category => ({
                    label: category.categoryName,
                    icon: category.categoryIcon ? `fas fa-${category.categoryIcon}` : 'fas fa-tag',
                    routerLink: [`/category/${category.id}`],
                }));
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = this.translate.instant('Navigation.FailedToLoadCategories');
                this.model[1].items = [];
                this.isLoading = false;
            },
        });
    }
}
