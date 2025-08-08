import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ProductService } from '@/services/product.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
    <ul class="layout-menu">
        @if (isLoading) {
            <li class="text-center py-4">
                <i class="pi pi-spin pi-spinner" style="font-size: 1.5rem"></i>
                <div>Loading categories...</div>
            </li>
        }
        @if (!isLoading && errorMessage) {
            <li class="text-center py-4 text-red-500">
                {{ errorMessage }}
            </li>
        }
        @if (!isLoading && !errorMessage) {
            @for (item of model; track item.label; let i = $index) {
                @if (!item.separator) {
                    <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
                }
                @if (item.separator) {
                    <li class="menu-separator"></li>
                }
            }
        }
    </ul>
    `
})
export class AppMenu {
    model: MenuItem[] = [
        {
            items: []
        }
    ];
    isLoading: boolean = true;
    errorMessage: string = '';

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.listProductCategories();
    }

    listProductCategories(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.productService.getProductCategories().subscribe({
            next: (data) => {
                this.model[0].label = 'Categories';
                this.model[0].items = data.map((category) => ({
                    label: category.categoryName,
                    routerLink: [`/category/${category.id}`]
                }));
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load categories. Please try again.';
                this.model[0].items = [];
                this.isLoading = false;
            }
        });
    }
}
