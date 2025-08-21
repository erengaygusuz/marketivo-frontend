# NgRx Store Documentation

This directory contains the NgRx store implementation for the Marketivo Frontend application. The store follows the standard NgRx pattern with actions, reducers, effects, and selectors organized by feature.

## 📁 Structure

```
store/
├── app.state.ts           # Root application state interface
├── root.reducer.ts        # Root reducer combining all feature reducers
├── auth/                  # Authentication state management
├── cart/                  # Shopping cart state management
├── checkout/              # Checkout process state management
├── language/              # Internationalization state management
├── order-history/         # Order history state management
└── product/               # Product catalog state management
```

## 🏗️ Architecture

### State Management Pattern

Each feature module follows the NgRx pattern:

```
feature/
├── feature.actions.ts     # Action definitions
├── feature.reducer.ts     # State reducer
├── feature.effects.ts     # Side effects handling
├── feature.selectors.ts   # State selectors
└── feature.state.ts       # State interface
```

### Root State Interface

```typescript
export interface AppState {
    cart: CartState;
    language: LanguageState;
    auth: AuthState;
    product: ProductState;
    orderHistory: OrderHistoryState;
    checkout: CheckoutState;
}
```

## 🔧 Features

### Authentication Store (`auth/`)

Manages user authentication state including:
- User login/logout status
- User profile information
- Authentication loading states
- Token management

**Key Actions:**
- `login()` - Initiate login process
- `logout()` - Clear user session
- `loadUserProfile()` - Fetch user profile data
- `updateAuthInfo()` - Update authentication information

**Key Selectors:**
- `selectIsAuthenticated` - Check if user is authenticated
- `selectUser` - Get current user data
- `selectUserProfile` - Get user profile information
- `selectIsLoading` - Get authentication loading state

### Shopping Cart Store (`cart/`)

Manages shopping cart state including:
- Cart items and quantities
- Total price calculations
- Cart persistence
- Item modifications

**Key Actions:**
- `addToCart()` - Add item to cart
- `removeFromCart()` - Remove item from cart
- `updateQuantity()` - Update item quantity
- `clearCart()` - Empty the cart
- `loadCart()` - Load cart from storage

**Key Selectors:**
- `selectCartItems` - Get all cart items
- `selectCartTotalPrice` - Get total cart price
- `selectCartTotalQuantity` - Get total item count
- `selectCartItemCount` - Get number of unique items

### Checkout Store (`checkout/`)

Manages the checkout process including:
- Customer information
- Shipping details
- Payment processing
- Order placement

**Key Actions:**
- `setCustomerInfo()` - Set customer details
- `setShippingAddress()` - Set shipping information
- `createPaymentIntent()` - Initialize payment
- `placeOrder()` - Submit order
- `resetCheckout()` - Clear checkout state

**Key Selectors:**
- `selectCustomerInfo` - Get customer information
- `selectShippingAddress` - Get shipping details
- `selectPaymentIntent` - Get payment information
- `selectCheckoutLoading` - Get checkout loading state

### Language Store (`language/`)

Manages internationalization state including:
- Current language selection
- Available languages
- Language switching

**Key Actions:**
- `setLanguage()` - Change current language
- `loadSupportedLanguages()` - Load available languages

**Key Selectors:**
- `selectCurrentLanguage` - Get current language
- `selectSupportedLanguages` - Get available languages

### Product Store (`product/`)

Manages product catalog state including:
- Product listings
- Product categories
- Product details
- Search and filtering

**Key Actions:**
- `loadProducts()` - Fetch product list
- `loadProductDetails()` - Fetch single product
- `loadCategories()` - Fetch product categories
- `searchProducts()` - Search products
- `filterByCategory()` - Filter by category

**Key Selectors:**
- `selectProducts` - Get product list
- `selectCurrentProduct` - Get selected product
- `selectCategories` - Get product categories
- `selectProductsLoading` - Get loading state

### Order History Store (`order-history/`)

Manages user order history including:
- Past orders
- Order details
- Order status tracking

**Key Actions:**
- `loadOrderHistory()` - Fetch order history
- `loadOrderDetails()` - Fetch specific order
- `refreshOrderHistory()` - Reload order data

**Key Selectors:**
- `selectOrderHistory` - Get order history
- `selectCurrentOrder` - Get selected order
- `selectOrderHistoryLoading` - Get loading state

## 🎯 Usage Examples

### Using Store in Components

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import * as ProductActions from '../store/product/product.actions';
import * as ProductSelectors from '../store/product/product.selectors';

@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of products$ | async">
      {{ product.name }}
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;

  constructor(private store: Store<AppState>) {
    this.products$ = this.store.select(ProductSelectors.selectProducts);
  }

  ngOnInit() {
    this.store.dispatch(ProductActions.loadProducts());
  }
}
```

### Using with Facades (Recommended)

Instead of directly using the store in components, use facades for better abstraction:

```typescript
import { Component, OnInit } from '@angular/core';
import { ProductFacade } from '../facades/product.facade';

@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of productFacade.products$ | async">
      {{ product.name }}
    </div>
  `
})
export class ProductListComponent implements OnInit {
  constructor(public productFacade: ProductFacade) {}

  ngOnInit() {
    this.productFacade.loadProducts();
  }
}
```

## 🔍 Effects

Effects handle side effects like API calls, logging, and other asynchronous operations:

### Example Effect Structure

```typescript
@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductActions.loadProductsFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}
}
```

## 🛠️ Best Practices

### 1. Action Naming Convention

```typescript
// ✅ Good: Clear, descriptive action names
export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: any }>()
);

// ❌ Avoid: Vague action names
export const load = createAction('[Product] Load');
```

### 2. Selector Organization

```typescript
// ✅ Good: Composable selectors
export const selectProductState = (state: AppState) => state.product;
export const selectProducts = createSelector(
  selectProductState,
  state => state.products
);
export const selectProductsLoading = createSelector(
  selectProductState,
  state => state.loading
);

// Derived selectors
export const selectFeaturedProducts = createSelector(
  selectProducts,
  products => products.filter(p => p.featured)
);
```

### 3. State Structure

```typescript
// ✅ Good: Normalized state with metadata
export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: Pagination;
}

// ❌ Avoid: Nested, denormalized state
export interface ProductState {
  data: {
    products: {
      [categoryId: string]: {
        items: Product[];
        meta: any;
      }
    }
  }
}
```

### 4. Error Handling

```typescript
// ✅ Good: Consistent error handling
const reducer = createReducer(
  initialState,
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message || 'Failed to load products'
  }))
);
```

## 📊 State Debugging

### Using Redux DevTools

The application includes Redux DevTools integration for debugging:

1. Install Redux DevTools browser extension
2. Open browser developer tools
3. Navigate to Redux tab
4. Inspect actions, state changes, and time travel

### Common Debugging Commands

```typescript
// Log current state
console.log(store.getState());

// Subscribe to state changes
store.subscribe(() => {
  console.log('State changed:', store.getState());
});
```

## 🧪 Testing Store

### Testing Reducers

```typescript
describe('ProductReducer', () => {
  it('should handle loadProductsSuccess', () => {
    const products = [{ id: 1, name: 'Test Product' }];
    const action = ProductActions.loadProductsSuccess({ products });
    const state = productReducer(initialState, action);

    expect(state.products).toEqual(products);
    expect(state.loading).toBe(false);
  });
});
```

### Testing Effects

```typescript
describe('ProductEffects', () => {
  it('should load products successfully', () => {
    const products = [{ id: 1, name: 'Test Product' }];
    const action = ProductActions.loadProducts();
    const outcome = ProductActions.loadProductsSuccess({ products });

    actions$ = hot('-a', { a: action });
    const response = cold('-b|', { b: products });
    productService.getProducts = jest.fn(() => response);

    const expected = cold('--c', { c: outcome });
    expect(effects.loadProducts$).toBeObservable(expected);
  });
});
```

## 🔗 Related Documentation

- [Facades Documentation](../facades/README.md) - How to use facades with the store
- [Services Documentation](../services/README.md) - Services used by effects
- [NgRx Official Documentation](https://ngrx.io/docs)

## 📝 Notes

- Always use typed actions with proper payload interfaces
- Keep reducers pure and immutable
- Use selectors for all state access
- Handle loading and error states consistently
- Prefer facades over direct store usage in components
- Use meaningful action names with feature prefixes
- Test reducers, effects, and selectors thoroughly
