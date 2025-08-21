# Services Documentation

This directory contains Angular services that handle business logic, API communication, and utility functions. Services are injectable classes that provide specific functionality to components and other parts of the application.

## 📁 Structure

```
services/
├── cart.service.ts              # Shopping cart operations
├── checkout.service.ts          # Checkout and payment processing
├── country-state.service.ts     # Geographic data management
├── fluent-validation.service.ts # Form validation utilities
├── language.service.ts          # Internationalization support
├── layout.service.ts            # UI layout management
├── order-history.service.ts     # Order history operations
└── product.service.ts           # Product catalog management
```

## 🎯 Service Architecture

### HTTP Services Pattern

Most services follow this pattern for API communication:

```typescript
@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private readonly apiUrl = `${environment.apiBaseUrl}/feature`;

  constructor(private http: HttpClient) {}

  getItems(): Observable<GetResponse<Item>> {
    return this.http.get<GetResponse<Item>>(this.apiUrl);
  }

  getItem(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  createItem(item: CreateItemRequest): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  updateItem(id: string, item: UpdateItemRequest): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

## 🔧 Available Services

### CartService

Manages shopping cart operations and persistence.

**Key Methods:**
- `getCartItems()` - Retrieve cart items from storage
- `saveCartItems(items)` - Persist cart items to storage
- `addToCart(product, quantity)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Empty the cart
- `calculateTotalPrice(items)` - Calculate cart total
- `calculateTotalQuantity(items)` - Calculate item count

**Storage Strategy:**
```typescript
export class CartService {
  private readonly STORAGE_KEY = 'marketivo-cart';

  getCartItems(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  }

  saveCartItems(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }
}
```

**Usage Example:**
```typescript
@Component({})
export class CartComponent {
  constructor(private cartService: CartService) {}

  addProduct(product: Product) {
    this.cartService.addToCart(product, 1);
  }
}
```

### CheckoutService

Handles checkout process and payment integration.

**Key Methods:**
- `createPaymentIntent(purchase)` - Create Stripe payment intent
- `placeOrder(purchase)` - Submit order to backend
- `validateCheckoutData(data)` - Validate checkout form
- `calculateShipping(address)` - Calculate shipping costs
- `processPayment(paymentData)` - Process payment

**Payment Integration:**
```typescript
export class CheckoutService {
  private readonly checkoutUrl = `${environment.apiBaseUrl}/checkout`;

  createPaymentIntent(purchase: Purchase): Observable<GetResponsePaymentIntent> {
    return this.http.post<GetResponsePaymentIntent>(
      `${this.checkoutUrl}/payment-intent`,
      purchase
    ).pipe(
      catchError(this.handlePaymentError)
    );
  }

  placeOrder(purchase: Purchase): Observable<GetResponsePlaceOrder> {
    return this.http.post<GetResponsePlaceOrder>(
      `${this.checkoutUrl}/purchase`,
      purchase
    ).pipe(
      retry(2),
      catchError(this.handleOrderError)
    );
  }

  private handlePaymentError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Payment processing failed';
    
    if (error.status === 400) {
      errorMessage = 'Invalid payment information';
    } else if (error.status === 402) {
      errorMessage = 'Payment declined';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
```

### ProductService

Manages product catalog operations.

**Key Methods:**
- `getProducts(params?)` - Fetch product list with filtering/pagination
- `getProduct(id)` - Fetch single product details
- `getProductsByCategory(categoryId)` - Fetch products by category
- `getCategories()` - Fetch product categories
- `searchProducts(query)` - Search products by name/description

**Caching Strategy:**
```typescript
export class ProductService {
  private productsCache = new Map<string, Product>();
  private categoriesCache: ProductCategory[] | null = null;

  getProduct(id: string): Observable<Product> {
    // Check cache first
    if (this.productsCache.has(id)) {
      return of(this.productsCache.get(id)!);
    }

    // Fetch from API and cache
    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(
      tap(product => this.productsCache.set(id, product)),
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<GetResponseProductCategory> {
    // Use cached categories if available
    if (this.categoriesCache) {
      return of({ content: this.categoriesCache });
    }

    return this.http.get<GetResponseProductCategory>(this.categoriesUrl).pipe(
      tap(response => this.categoriesCache = response.content),
      catchError(this.handleError)
    );
  }
}
```

### CountryStateService

Provides geographic data for address forms.

**Key Methods:**
- `getCountries()` - Fetch list of countries
- `getStates(countryCode)` - Fetch states/provinces for a country
- `validateAddress(address)` - Validate address format

**Geographic Data Management:**
```typescript
export class CountryStateService {
  private countriesCache: Country[] | null = null;
  private statesCache = new Map<string, State[]>();

  getCountries(): Observable<GetResponseCountry> {
    if (this.countriesCache) {
      return of({ content: this.countriesCache });
    }

    return this.http.get<GetResponseCountry>(this.countriesUrl).pipe(
      tap(response => this.countriesCache = response.content),
      shareReplay(1) // Share the result among multiple subscribers
    );
  }

  getStates(countryCode: string): Observable<GetResponseState> {
    const cacheKey = countryCode;
    
    if (this.statesCache.has(cacheKey)) {
      return of({ content: this.statesCache.get(cacheKey)! });
    }

    return this.http.get<GetResponseState>(`${this.statesUrl}/${countryCode}`).pipe(
      tap(response => this.statesCache.set(cacheKey, response.content)),
      shareReplay(1)
    );
  }
}
```

### LanguageService

Manages internationalization and localization.

**Key Methods:**
- `getSupportedLanguages()` - Get available languages
- `getCurrentLanguage()` - Get current language setting
- `setLanguage(code)` - Change application language
- `getTranslation(key)` - Get translated text
- `formatDate(date, locale)` - Format date for locale
- `formatCurrency(amount, locale)` - Format currency for locale

**Language Management:**
```typescript
export class LanguageService {
  private currentLanguage$ = new BehaviorSubject<Language>(
    this.getDefaultLanguage()
  );

  getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  setLanguage(languageCode: string): void {
    const language = this.findLanguageByCode(languageCode);
    if (language) {
      this.currentLanguage$.next(language);
      this.translateService.use(languageCode);
      this.saveLanguagePreference(languageCode);
    }
  }

  getSupportedLanguages(): Language[] {
    return environment.i18n.supportedLanguages.map(code => ({
      code,
      name: this.getLanguageName(code),
      flag: this.getLanguageFlag(code)
    }));
  }

  private saveLanguagePreference(languageCode: string): void {
    localStorage.setItem('preferred-language', languageCode);
  }

  private getDefaultLanguage(): Language {
    const saved = localStorage.getItem('preferred-language');
    const code = saved || environment.i18n.defaultLanguage;
    return {
      code,
      name: this.getLanguageName(code),
      flag: this.getLanguageFlag(code)
    };
  }
}
```

### FluentValidationService

Provides form validation utilities using FluentValidation-TS.

**Key Methods:**
- `validateObject(validator, object)` - Validate object with validator
- `getErrorMessage(error, translate)` - Get localized error message
- `createAngularValidator(fluentValidator)` - Convert to Angular validator
- `validateForm(form, validators)` - Validate entire form

**Validation Integration:**
```typescript
export class FluentValidationService {
  validateObject<T>(validator: Validator<T>, object: T): ValidationResult {
    return validator.validate(object);
  }

  getErrorMessage(error: ValidationFailure, translateService: TranslateService): string {
    return translateService.instant(error.errorMessage);
  }

  createAngularValidator<T>(
    fluentValidator: Validator<T>
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const result = this.validateObject(fluentValidator, control.value);
      
      if (result.isValid) {
        return null;
      }

      const errors: ValidationErrors = {};
      result.errors.forEach(error => {
        errors[error.propertyName] = {
          message: error.errorMessage,
          value: error.attemptedValue
        };
      });

      return errors;
    };
  }
}
```

### LayoutService

Manages UI layout state and responsive behavior.

**Key Methods:**
- `getLayoutConfig()` - Get current layout configuration
- `updateLayoutConfig(config)` - Update layout settings
- `toggleSidebar()` - Toggle sidebar visibility
- `toggleDarkMode()` - Toggle dark/light theme
- `setMobileMode(isMobile)` - Set mobile layout mode

**Layout State Management:**
```typescript
export class LayoutService {
  private layoutConfig$ = new BehaviorSubject<LayoutConfig>(
    this.getDefaultLayoutConfig()
  );

  private layoutState$ = new BehaviorSubject<LayoutState>({
    sidebarVisible: false,
    darkMode: false,
    mobileMode: false
  });

  getLayoutConfig(): Observable<LayoutConfig> {
    return this.layoutConfig$.asObservable();
  }

  getLayoutState(): Observable<LayoutState> {
    return this.layoutState$.asObservable();
  }

  toggleSidebar(): void {
    const currentState = this.layoutState$.value;
    this.layoutState$.next({
      ...currentState,
      sidebarVisible: !currentState.sidebarVisible
    });
  }

  setMobileMode(isMobile: boolean): void {
    const currentState = this.layoutState$.value;
    this.layoutState$.next({
      ...currentState,
      mobileMode: isMobile,
      sidebarVisible: isMobile ? false : currentState.sidebarVisible
    });
  }
}
```

### OrderHistoryService

Manages user order history operations.

**Key Methods:**
- `getOrderHistory(userId)` - Fetch user's order history
- `getOrderDetails(orderId)` - Fetch specific order details
- `downloadInvoice(orderId)` - Download order invoice
- `trackOrder(orderId)` - Get order tracking information
- `cancelOrder(orderId)` - Cancel an order (if allowed)

**Order Management:**
```typescript
export class OrderHistoryService {
  getOrderHistory(
    userId: string,
    page: number = 0,
    size: number = 20
  ): Observable<GetResponseOrderHistory> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<GetResponseOrderHistory>(
      `${this.ordersUrl}/user/${userId}`,
      { params }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getOrderDetails(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${orderId}`).pipe(
      catchError(this.handleError)
    );
  }

  downloadInvoice(orderId: string): Observable<Blob> {
    return this.http.get(`${this.ordersUrl}/${orderId}/invoice`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }
}
```

## 🛠️ Best Practices

### 1. Error Handling

```typescript
// ✅ Good: Centralized error handling
export class BaseService {
  protected handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          break;
        case 404:
          errorMessage = 'Not found';
          break;
        case 500:
          errorMessage = 'Server error';
          break;
      }
    }
    
    console.error('Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}

// Extend BaseService
export class ProductService extends BaseService {
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
}
```

### 2. Caching Strategies

```typescript
// ✅ Good: Smart caching with expiration
export class CacheableService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getData(id: string): Observable<Data> {
    const cached = this.getCached<Data>(id);
    if (cached) {
      return of(cached);
    }

    return this.http.get<Data>(`${this.apiUrl}/${id}`).pipe(
      tap(data => this.setCache(id, data))
    );
  }
}
```

### 3. Type Safety

```typescript
// ✅ Good: Strong typing with interfaces
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export class TypedService {
  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl);
  }

  createProduct(product: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
  }
}
```

### 4. Loading States

```typescript
// ✅ Good: Built-in loading state management
export class LoadingAwareService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  getData(): Observable<Data> {
    this.setLoading(true);
    
    return this.http.get<Data>(this.apiUrl).pipe(
      finalize(() => this.setLoading(false)),
      catchError(this.handleError)
    );
  }
}
```

## 🧪 Testing Services

### Unit Testing

```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch products', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 }
    ];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should handle errors', () => {
    service.getProducts().subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.message).toContain('error occurred');
      }
    });

    const req = httpMock.expectOne(service.apiUrl);
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });
});
```

### Integration Testing

```typescript
describe('CartService Integration', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    
    service = TestBed.inject(CartService);
    localStorage.clear();
  });

  it('should persist cart items', () => {
    const product = { id: '1', name: 'Test Product', price: 100 };
    
    service.addToCart(product, 2);
    
    const items = service.getCartItems();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe('1');
    expect(items[0].quantity).toBe(2);
  });
});
```

## 🔗 HTTP Interceptors

Services work with HTTP interceptors for cross-cutting concerns:

### Auth Interceptor
```typescript
// Automatically adds auth tokens to API requests
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  if (req.url.includes('/api/')) {
    const token = authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  }
  
  return next(req);
};
```

### Language Interceptor
```typescript
// Adds Accept-Language header
export const LanguageInterceptor: HttpInterceptorFn = (req, next) => {
  const translateService = inject(TranslateService);
  const currentLang = translateService.currentLang;
  
  req = req.clone({
    setHeaders: { 'Accept-Language': currentLang }
  });
  
  return next(req);
};
```

## 📚 Service Dependencies

### Dependency Injection

```typescript
// ✅ Good: Use constructor injection
@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService
  ) {}
}

// ✅ Good: Use inject() in functional contexts
export function createOrderValidator() {
  const translateService = inject(TranslateService);
  
  return new OrderValidator(translateService);
}
```

## 🔗 Related Documentation

- [Store Documentation](../store/README.md) - State management
- [Facades Documentation](../facades/README.md) - Service abstraction
- [Interceptors Documentation](../interceptors/README.md) - HTTP interceptors
- [Models Documentation](../models/README.md) - Data types and interfaces

## 📝 Guidelines

- Always handle errors appropriately
- Use caching for frequently accessed data
- Implement loading states for better UX
- Follow consistent naming conventions
- Write comprehensive tests
- Use TypeScript interfaces for type safety
- Keep services focused on single responsibilities
- Document public APIs and complex logic
