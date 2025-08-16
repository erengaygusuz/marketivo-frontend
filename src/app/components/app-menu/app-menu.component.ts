import { ProductService } from '@/services/product.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { ProductCategory } from '../../common/models/product-category';
import { AppState } from '../../store/app.state';
import { selectCurrentLanguage } from '../../store/language/language.selectors';
import * as ProductActions from '../../store/product/product.actions';
import { selectCategories, selectCategoriesLoading, selectProductError } from '../../store/product/product.selectors';
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
        private productService: ProductService,
        private translate: TranslateService,
        private store: Store<AppState>
    ) {
        this.categories$ = this.store.select(selectCategories);
        this.categoriesLoading$ = this.store.select(selectCategoriesLoading);
        this.error$ = this.store.select(selectProductError);
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);
    }

    ngOnInit() {
        this.initializeMenu();
        this.loadCategories();

        // Subscribe to language changes to update the menu labels
        this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
            this.updateMenuLabels();
        });

        // Subscribe to categories changes
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
            this.store.dispatch(ProductActions.loadCategories({ language }));
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
