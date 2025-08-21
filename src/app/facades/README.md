# Facades Documentation

This directory contains facade services that provide a clean, simplified API for interacting with the NgRx store. Facades abstract the complexity of store operations and provide a reactive interface for components.

## 📁 Structure

```
facades/
├── auth.facade.ts           # Authentication facade
├── cart.facade.ts           # Shopping cart facade
├── checkout.facade.ts       # Checkout process facade
├── language.facade.ts       # Language switching facade
├── order-history.facade.ts  # Order history facade
└── product.facade.ts        # Product management facade
```

## 🎯 Purpose

Facades serve as an abstraction layer between components and the NgRx store, providing:

- **Simplified API** - Clean, intuitive methods for common operations
- **Reactive Interface** - Observable streams for real-time data
- **Encapsulation** - Hide store complexity from components
- **Testability** - Easier to mock and test than direct store usage
- **Consistency** - Standardized patterns across the application

## 🏗️ Architecture

### Facade Pattern Implementation

Each facade follows this structure:

```typescript
@Injectable({
  providedIn: 'root',
})
export class FeatureFacade {
  // Expose observable streams for reactive data
  get data$(): Observable<DataType> {
    return this.store.select(FeatureSelectors.selectData);
  }

  get loading$(): Observable<boolean> {
    return this.store.select(FeatureSelectors.selectLoading);
  }

  get error$(): Observable<string | null> {
    return this.store.select(FeatureSelectors.selectError);
  }

  constructor(private store: Store<AppState>) {}

  // Provide action dispatch methods
  loadData(): void {
    this.store.dispatch(FeatureActions.loadData());
  }

  updateData(data: DataType): void {
    this.store.dispatch(FeatureActions.updateData({ data }));
  }
}
```

## 🔧 Available Facades

### AuthFacade

Manages authentication state and operations.

**Observable Properties:**
- `isAuthenticated$` - Authentication status
- `isLoading$` - Authentication loading state
- `user$` - Current user information
- `userProfile$` - Detailed user profile
- `authInfo$` - Authentication information

**Methods:**
- `login()` - Initiate login process
- `logout()` - Clear user session
- `loadUserProfile()` - Fetch user profile
- `updateUserProfile(profile)` - Update user profile
- `updateAuthInfo(authInfo)` - Update auth information

**Usage Example:**
```typescript
@Component({
  template: `
    <div *ngIf="authFacade.isAuthenticated$ | async">
      Welcome, {{ (authFacade.user$ | async)?.name }}!
      <button (click)="authFacade.logout()">Logout</button>
    </div>
    <div *ngIf="!(authFacade.isAuthenticated$ | async)">
      <button (click)="authFacade.login()">Login</button>
    </div>
  `
})
export class HeaderComponent {
  constructor(public authFacade: AuthFacade) {}
}
```

### CartFacade

Manages shopping cart state and operations.

**Observable Properties:**
- `cartItems$` - List of cart items
- `totalPrice$` - Total cart price
- `totalQuantity$` - Total item quantity
- `itemCount$` - Number of unique items
- `isLoading$` - Cart loading state

**Methods:**
- `addToCart(product, quantity?)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Empty the cart
- `loadCart()` - Load cart from storage

**Usage Example:**
```typescript
@Component({
  template: `
    <div class="cart-summary">
      <span>Items: {{ cartFacade.itemCount$ | async }}</span>
      <span>Total: {{ cartFacade.totalPrice$ | async | currency }}</span>
    </div>
    <button (click)="addProduct()" 
            [disabled]="cartFacade.isLoading$ | async">
      Add to Cart
    </button>
  `
})
export class ProductComponent {
  constructor(public cartFacade: CartFacade) {}

  addProduct() {
    this.cartFacade.addToCart(this.product, 1);
  }
}
```

### CheckoutFacade

Manages the checkout process.

**Observable Properties:**
- `customerInfo$` - Customer information
- `shippingAddress$` - Shipping address
- `billingAddress$` - Billing address
- `paymentIntent$` - Payment intent data
- `isLoading$` - Checkout loading state
- `error$` - Checkout errors

**Methods:**
- `setCustomerInfo(customerInfo)` - Set customer details
- `setShippingAddress(address)` - Set shipping address
- `setBillingAddress(address)` - Set billing address
- `createPaymentIntent(amount)` - Create payment intent
- `placeOrder(orderData)` - Submit order
- `resetCheckout()` - Clear checkout state

**Usage Example:**
```typescript
@Component({
  template: `
    <form (ngSubmit)="submitOrder()">
      <!-- Customer info form -->
      <button type="submit" 
              [disabled]="checkoutFacade.isLoading$ | async">
        Place Order
      </button>
    </form>
  `
})
export class CheckoutComponent {
  constructor(public checkoutFacade: CheckoutFacade) {}

  submitOrder() {
    this.checkoutFacade.placeOrder(this.orderData);
  }
}
```

### LanguageFacade

Manages internationalization and language switching.

**Observable Properties:**
- `currentLanguage$` - Current selected language
- `supportedLanguages$` - Available languages
- `isLoading$` - Language loading state

**Methods:**
- `setLanguage(languageCode)` - Change current language
- `loadSupportedLanguages()` - Load available languages
- `toggleLanguage()` - Switch between supported languages

**Usage Example:**
```typescript
@Component({
  template: `
    <select (change)="changeLanguage($event)">
      <option *ngFor="let lang of languageFacade.supportedLanguages$ | async" 
              [value]="lang.code"
              [selected]="lang.code === (languageFacade.currentLanguage$ | async)?.code">
        {{ lang.name }}
      </option>
    </select>
  `
})
export class LanguageSelectorComponent {
  constructor(public languageFacade: LanguageFacade) {}

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.languageFacade.setLanguage(target.value);
  }
}
```

### OrderHistoryFacade

Manages user order history.

**Observable Properties:**
- `orderHistory$` - List of user orders
- `currentOrder$` - Selected order details
- `isLoading$` - Loading state
- `error$` - Error messages

**Methods:**
- `loadOrderHistory()` - Fetch order history
- `loadOrderDetails(orderId)` - Fetch specific order
- `refreshOrderHistory()` - Reload order data
- `clearCurrentOrder()` - Clear selected order

**Usage Example:**
```typescript
@Component({
  template: `
    <div *ngFor="let order of orderHistoryFacade.orderHistory$ | async">
      <div (click)="viewOrder(order.id)">
        Order #{{ order.id }} - {{ order.total | currency }}
      </div>
    </div>
  `
})
export class OrderHistoryComponent implements OnInit {
  constructor(public orderHistoryFacade: OrderHistoryFacade) {}

  ngOnInit() {
    this.orderHistoryFacade.loadOrderHistory();
  }

  viewOrder(orderId: string) {
    this.orderHistoryFacade.loadOrderDetails(orderId);
  }
}
```

### ProductFacade

Manages product catalog and operations.

**Observable Properties:**
- `products$` - List of products
- `categories$` - Product categories
- `currentProduct$` - Selected product details
- `isLoading$` - Loading state
- `error$` - Error messages
- `pagination$` - Pagination information

**Methods:**
- `loadProducts(params?)` - Fetch product list
- `loadProductDetails(productId)` - Fetch single product
- `loadCategories()` - Fetch categories
- `searchProducts(query)` - Search products
- `filterByCategory(categoryId)` - Filter by category
- `clearCurrentProduct()` - Clear selected product

**Usage Example:**
```typescript
@Component({
  template: `
    <div class="products-grid">
      <div *ngFor="let product of productFacade.products$ | async"
           (click)="viewProduct(product.id)">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price | currency }}</p>
      </div>
    </div>
    <div *ngIf="productFacade.isLoading$ | async">Loading...</div>
  `
})
export class ProductListComponent implements OnInit {
  constructor(public productFacade: ProductFacade) {}

  ngOnInit() {
    this.productFacade.loadProducts();
  }

  viewProduct(productId: string) {
    this.productFacade.loadProductDetails(productId);
  }
}
```

## 🎯 Best Practices

### 1. Use Public Properties for Observables

```typescript
// ✅ Good: Public getters for reactive data
export class CartFacade {
  get cartItems$(): Observable<CartItem[]> {
    return this.store.select(CartSelectors.selectCartItems);
  }
}

// ❌ Avoid: Exposing store directly
export class CartFacade {
  constructor(public store: Store<AppState>) {}
}
```

### 2. Provide Meaningful Method Names

```typescript
// ✅ Good: Clear, action-oriented methods
addToCart(product: Product, quantity: number = 1): void {
  this.store.dispatch(CartActions.addToCart({ product, quantity }));
}

removeFromCart(productId: string): void {
  this.store.dispatch(CartActions.removeFromCart({ productId }));
}

// ❌ Avoid: Generic or unclear method names
dispatch(action: string, payload: any): void {
  // Don't expose generic dispatch
}
```

### 3. Handle Loading and Error States

```typescript
// ✅ Good: Expose loading and error states
export class ProductFacade {
  get isLoading$(): Observable<boolean> {
    return this.store.select(ProductSelectors.selectLoading);
  }

  get error$(): Observable<string | null> {
    return this.store.select(ProductSelectors.selectError);
  }
}
```

### 4. Compose Complex Operations

```typescript
// ✅ Good: Combine related operations
addToCartAndNavigate(product: Product): void {
  this.addToCart(product);
  this.router.navigate(['/cart']);
}

// ✅ Good: Provide convenience methods
toggleFavorite(productId: string): void {
  // Check current state and toggle
  this.isFavorite$(productId).pipe(
    take(1),
    tap(isFavorite => {
      if (isFavorite) {
        this.removeFromFavorites(productId);
      } else {
        this.addToFavorites(productId);
      }
    })
  ).subscribe();
}
```

## 🧪 Testing Facades

### Unit Testing Example

```typescript
describe('CartFacade', () => {
  let facade: CartFacade;
  let store: MockStore<AppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartFacade,
        provideMockStore({ initialState: mockAppState })
      ]
    });
    
    facade = TestBed.inject(CartFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch addToCart action', () => {
    const product = { id: '1', name: 'Test Product', price: 100 };
    const spy = jest.spyOn(store, 'dispatch');

    facade.addToCart(product, 2);

    expect(spy).toHaveBeenCalledWith(
      CartActions.addToCart({ product, quantity: 2 })
    );
  });

  it('should select cart items', () => {
    const mockItems = [{ id: '1', quantity: 2 }];
    store.overrideSelector(CartSelectors.selectCartItems, mockItems);

    facade.cartItems$.subscribe(items => {
      expect(items).toEqual(mockItems);
    });
  });
});
```

### Integration Testing

```typescript
describe('CartFacade Integration', () => {
  let facade: CartFacade;
  let store: Store<AppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ cart: cartReducer })],
      providers: [CartFacade]
    });
    
    facade = TestBed.inject(CartFacade);
    store = TestBed.inject(Store);
  });

  it('should add item to cart and update state', () => {
    const product = { id: '1', name: 'Test Product', price: 100 };
    
    facade.addToCart(product, 1);
    
    facade.cartItems$.subscribe(items => {
      expect(items).toContainEqual(
        expect.objectContaining({ productId: '1', quantity: 1 })
      );
    });
  });
});
```

## 🔄 Component Integration

### Reactive Components

```typescript
@Component({
  template: `
    <div class="product-page">
      <!-- Use async pipe for reactive updates -->
      <div *ngIf="productFacade.isLoading$ | async" class="loading">
        Loading product...
      </div>
      
      <div *ngIf="productFacade.currentProduct$ | async as product" 
           class="product-details">
        <h1>{{ product.name }}</h1>
        <p>{{ product.price | currency }}</p>
        
        <button (click)="addToCart(product)"
                [disabled]="cartFacade.isLoading$ | async">
          Add to Cart ({{ cartFacade.itemCount$ | async }})
        </button>
      </div>
      
      <div *ngIf="productFacade.error$ | async as error" 
           class="error">
        {{ error }}
      </div>
    </div>
  `
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    public productFacade: ProductFacade,
    public cartFacade: CartFacade,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productFacade.loadProductDetails(params['id']);
    });
  }

  addToCart(product: Product) {
    this.cartFacade.addToCart(product);
  }
}
```

## 📚 Advanced Patterns

### Composite Facades

For complex operations that span multiple domains:

```typescript
@Injectable({
  providedIn: 'root',
})
export class CheckoutOrchestratorFacade {
  constructor(
    private cartFacade: CartFacade,
    private checkoutFacade: CheckoutFacade,
    private authFacade: AuthFacade
  ) {}

  get canProceedToCheckout$(): Observable<boolean> {
    return combineLatest([
      this.cartFacade.itemCount$,
      this.authFacade.isAuthenticated$
    ]).pipe(
      map(([itemCount, isAuthenticated]) => 
        itemCount > 0 && isAuthenticated
      )
    );
  }

  async completeCheckout(orderData: OrderData): Promise<void> {
    // Orchestrate the entire checkout process
    await firstValueFrom(this.checkoutFacade.createPaymentIntent(orderData.total));
    await firstValueFrom(this.checkoutFacade.placeOrder(orderData));
    this.cartFacade.clearCart();
  }
}
```

## 🔗 Related Documentation

- [Store Documentation](../store/README.md) - NgRx store implementation
- [Services Documentation](../services/README.md) - Business logic services
- [Components Documentation](../components/README.md) - UI components

## 📝 Guidelines

- Always inject facades as public for template usage
- Use observables with async pipe in templates
- Handle loading and error states in UI
- Prefer facades over direct store injection in components
- Keep facade methods focused and single-purpose
- Use meaningful names for facade methods and properties
- Test facade behavior, not implementation details
