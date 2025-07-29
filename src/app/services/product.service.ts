import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../common/models/product';
import { GetResponseProduct } from '../common/interfaces/GetResponseProduct';
import { ProductCategory } from '../common/models/product-category';
import { GetResponseProductCategory } from '../common/interfaces/GetResponseProductCategory';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiBaseUrl}/products`;

  private categoryUrl = `${environment.apiBaseUrl}/product-category`;

  constructor(private httpClient: HttpClient) {}

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.httpClient
      .get<GetResponseProduct>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseProduct> {
    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient
      .get<GetResponseProduct>(searchUrl)
      .pipe(map((response) => response));
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

    return this.httpClient
      .get<GetResponseProduct>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    keyword: string
  ): Observable<GetResponseProduct> {
    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${keyword}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient
      .get<GetResponseProduct>(searchUrl)
      .pipe(map((response) => response));
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}
