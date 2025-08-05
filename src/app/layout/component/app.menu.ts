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
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [
        {
            items: []
        }
    ];

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.listProductCategories();
    }

    listProductCategories(): void {
        this.productService.getProductCategories().subscribe((data) => {
            this.model[0].label = 'Categories';
            this.model[0].items = data.map((category) => ({
                label: category.categoryName,
                routerLink: [`/category/${category.id}`]
            }));
        });
    }
}
