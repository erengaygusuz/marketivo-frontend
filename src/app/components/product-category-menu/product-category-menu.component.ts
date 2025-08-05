import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../common/models/product-category';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css',
  imports: [CommonModule, RouterModule],
})
export class ProductCategoryMenuComponent {
  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories(): void {
    this.productService.getProductCategories().subscribe((data) => {
      this.productCategories = data;
    });
  }
}
