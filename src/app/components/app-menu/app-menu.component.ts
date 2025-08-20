import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { LanguageFacade } from '../../facades/language.facade';
import { ProductFacade } from '../../facades/product.facade';
import { ProductCategory } from '../../models/product-category';
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

    categories$: Observable<ProductCategory[]>;
    categoriesLoading$: Observable<boolean>;
    error$: Observable<string | null>;
    currentLanguage$: Observable<string>;

    private langChangeSubscription: Subscription | null = null;
    private categoriesSubscription: Subscription | null = null;

    constructor(
        private translate: TranslateService,
        private productFacade: ProductFacade,
        private languageFacade: LanguageFacade
    ) {
        this.categories$ = this.productFacade.categories$;
        this.categoriesLoading$ = this.productFacade.categoriesLoading$;
        this.error$ = this.productFacade.productsErrorMessage$;
        this.currentLanguage$ = this.languageFacade.currentLanguage$;
    }

    ngOnInit() {
        this.initializeMenu();
        this.loadCategories();

        this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
            this.updateMenuLabels();
        });

        this.categoriesSubscription = this.categories$.subscribe(categories => {
            this.updateCategoriesMenu(categories);
        });
    }

    ngOnDestroy() {
        if (this.langChangeSubscription) {
            this.langChangeSubscription.unsubscribe();
        }
        if (this.categoriesSubscription) {
            this.categoriesSubscription.unsubscribe();
        }
    }

    private loadCategories(): void {
        this.currentLanguage$.subscribe(language => {
            this.productFacade.loadCategories(language);
        });
    }

    private updateCategoriesMenu(categories: ProductCategory[]): void {
        this.model[1].label = this.translate.instant('Navigation.Categories');
        this.model[1].items = categories.map(category => ({
            label: category.categoryName,
            icon: category.categoryIcon ? `fas fa-${category.categoryIcon}` : 'fas fa-tag',
            routerLink: [`/category/${category.id}`],
        }));
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
}
