import { AppAuthCallbackComponent } from '@/components/app-auth-callback/app-auth-callback.component';
import { AppCartDetailsComponent } from '@/components/app-cart-details/app-cart-details.component';
import { AppCheckoutComponent } from '@/components/app-checkout/app-checkout.component';
import { AppOrderHistoryComponent } from '@/components/app-order-history/app-order-history.component';
import { AppProductDetailsComponent } from '@/components/app-product-details/app-product-details.component';
import { AppProductListComponent } from '@/components/app-product-list/app-product-list.component';
import { AppProfilePageComponent } from '@/components/app-profile-page/app-profile-page.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { AppLayout } from './app/components/app-layout/app-layout.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: 'login/callback',
                component: AppAuthCallbackComponent,
            },
            {
                path: 'profile',
                component: AppProfilePageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'order-history',
                component: AppOrderHistoryComponent,
            },
            { path: 'checkout', component: AppCheckoutComponent },
            { path: 'cart-details', component: AppCartDetailsComponent },
            { path: 'products/:id', component: AppProductDetailsComponent },
            { path: 'search/:keyword', component: AppProductListComponent },
            { path: 'category/:id', component: AppProductListComponent },
            { path: 'category', component: AppProductListComponent },
            { path: 'products', component: AppProductListComponent },
            { path: '', redirectTo: '/products', pathMatch: 'full' },
            { path: '**', redirectTo: '/products', pathMatch: 'full' },
        ],
    },
];
