import { Routes } from '@angular/router';
import { AppLayout } from './app/components/app-layout';
import { CheckoutComponent } from '@/components/checkout/checkout.component';
import { CartDetailsComponent } from '@/components/cart-details/cart-details.component';
import { ProductDetailsComponent } from '@/components/product-details/product-details.component';
import { ProductListComponent } from '@/components/product-list/product-list.component';
import { OrderHistoryComponent } from '@/components/order-history/order-history.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProfilePageComponent } from '@/components/profile-page/profile-page.component';
import { AuthCallbackComponent } from '@/components/auth-callback/auth-callback.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: 'login/callback',
                component: AuthCallbackComponent
            },
            {
                path: 'profile',
                component: ProfilePageComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'order-history',
                component: OrderHistoryComponent,
                canActivate: [AuthGuard]
            },
            { path: 'checkout', component: CheckoutComponent },
            { path: 'cart-details', component: CartDetailsComponent },
            { path: 'products/:id', component: ProductDetailsComponent },
            { path: 'search/:keyword', component: ProductListComponent },
            { path: 'category/:id', component: ProductListComponent },
            { path: 'category', component: ProductListComponent },
            { path: 'products', component: ProductListComponent },
            { path: '', redirectTo: '/products', pathMatch: 'full' },
            { path: '**', redirectTo: '/products', pathMatch: 'full' }
        ]
    }
];
