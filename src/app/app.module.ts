import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatus } from './components/cart-status/cart-status';
import { CartDetails } from './components/cart-details/cart-details';
import { Checkout } from './components/checkout/checkout';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginStatus } from './components/login-status/login-status';
import { AuthModule } from '@auth0/auth0-angular';
import myAppConfig from './config/my-app-config';
import { MembersPage } from './components/members-page/members-page';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatus,
    CartDetails,
    Checkout,
    LoginStatus,
    MembersPage,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      ...myAppConfig.auth,
      // cacheLocation: 'localstorage',
      httpInterceptor: {
        ...myAppConfig.httpInterceptor,
      },
    })
  ],
  providers: [ProductService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true, },],
  bootstrap: [AppComponent]
})
export class AppModule { }
