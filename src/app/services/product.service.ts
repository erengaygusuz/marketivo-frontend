import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetResponseProduct } from '../models/get-response-product';
import { GetResponseProductCategory } from '../models/get-response-product-category';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private baseUrl = `${environment.apiBaseUrl}/products`;

    private categoryUrl = `${environment.apiBaseUrl}/product-category`;

    constructor(private httpClient: HttpClient) {}

    getProductList(theCategoryId: number, language?: string): Observable<Product[]> {
        let searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

        if (language) {
            searchUrl += `&lang=${language}`;
        }

        return this.httpClient
            .get<GetResponseProduct>(searchUrl)
            .pipe(map(response => response._embedded?.products || []));
    }

    getProductListPaginate(
        thePage: number,
        thePageSize: number,
        theCategoryId: number,
        language?: string
    ): Observable<GetResponseProduct> {
        let searchUrl =
            `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;

        if (language) {
            searchUrl += `&lang=${language}`;
        }

        return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(map(response => response));
    }

    getProductCategories(language?: string): Observable<ProductCategory[]> {
        let categoryUrl = this.categoryUrl;

        if (language) {
            categoryUrl += `?lang=${language}`;
        }

        return this.httpClient
            .get<GetResponseProductCategory>(categoryUrl)
            .pipe(map(response => response._embedded.productCategory));
    }

    searchProducts(keyword: string, language?: string): Observable<Product[]> {
        let searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

        if (language) {
            searchUrl += `&lang=${language}`;
        }

        return this.httpClient
            .get<GetResponseProduct>(searchUrl)
            .pipe(map(response => response._embedded?.products || []));
    }

    searchProductsPaginate(
        thePage: number,
        thePageSize: number,
        keyword: string,
        language?: string
    ): Observable<GetResponseProduct> {
        let searchUrl =
            `${this.baseUrl}/search/findByNameContaining?name=${keyword}` + `&page=${thePage}&size=${thePageSize}`;

        if (language) {
            searchUrl += `&lang=${language}`;
        }

        return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(map(response => response));
    }

    getProduct(theProductId: number, language?: string): Observable<Product> {
        let productUrl = `${this.baseUrl}/${theProductId}`;

        if (language) {
            productUrl += `?lang=${language}`;
        }

        return this.httpClient.get<Product>(productUrl);
    }
}
