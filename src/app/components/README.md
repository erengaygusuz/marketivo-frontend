# Components Documentation

This directory contains all the UI components for the Marketivo Frontend application. Components are built using Angular's standalone component architecture with modern reactive patterns and PrimeNG UI library integration.

## 📁 Structure

```
components/
├── app-auth-callback/       # Auth0 callback handler
├── app-cart-details/        # Shopping cart display
├── app-cart-status/         # Cart summary widget
├── app-checkout/            # Checkout process
├── app-footer/              # Application footer
├── app-language-selector/   # Language switcher
├── app-layout/              # Main layout wrapper
├── app-login-status/        # Authentication status
├── app-menu/                # Navigation menu
├── app-menuitem/            # Menu item component
├── app-order-history/       # Order history display
├── app-product-details/     # Product detail view
├── app-product-list/        # Product listing
├── app-profile-page/        # User profile management
├── app-sidebar/             # Sidebar navigation
└── app-topbar/              # Application header
```

## 🏗️ Component Architecture

### Standalone Components

All components use Angular's standalone architecture:

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    // PrimeNG components
    ButtonModule,
    InputTextModule,
    // Other imports
  ],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureComponent {
  // Component implementation
}
```

### Reactive Patterns

Components follow reactive patterns using RxJS and Angular's async pipe:

```typescript
export class ProductListComponent implements OnInit {
  // Reactive data streams
  products$ = this.productFacade.products$;
  loading$ = this.productFacade.isLoading$;
  error$ = this.productFacade.error$;

  constructor(
    public productFacade: ProductFacade,
    private cartFacade: CartFacade
  ) {}

  ngOnInit() {
    this.productFacade.loadProducts();
  }

  addToCart(product: Product) {
    this.cartFacade.addToCart(product);
  }
}
```

## 🎨 UI Framework Integration

### PrimeNG Components

The application uses PrimeNG for consistent UI components:

```html
<!-- Data Display -->
<p-dataView [value]="products$ | async" layout="grid">
  <ng-template pTemplate="gridItem" let-product>
    <div class="product-card">
      <p-image [src]="product.imageUrl" [alt]="product.name"></p-image>
      <h3>{{ product.name }}</h3>
      <p class="price">{{ product.price | currency }}</p>
      <p-button 
        label="{{ 'ProductList.AddToCart' | translate }}"
        (click)="addToCart(product)">
      </p-button>
    </div>
  </ng-template>
</p-dataView>

<!-- Forms -->
<form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
  <p-floatLabel>
    <input pInputText formControlName="firstName" />
    <label>{{ 'Checkout.FirstName' | translate }}</label>
  </p-floatLabel>
  
  <p-dropdown 
    [options]="countries$ | async"
    formControlName="country"
    optionLabel="name"
    optionValue="code">
  </p-dropdown>
</form>

<!-- Navigation -->
<p-menubar [model]="menuItems">
  <ng-template pTemplate="start">
    <img src="/assets/images/logo.png" alt="Marketivo" height="40">
  </ng-template>
  
  <ng-template pTemplate="end">
    <app-cart-status></app-cart-status>
    <app-login-status></app-login-status>
    <app-language-selector></app-language-selector>
  </ng-template>
</p-menubar>
```

### TailwindCSS Styling

Components use TailwindCSS with PrimeNG integration:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ product.name }}
      </h3>
      <span class="text-xl font-bold text-primary">
        {{ product.price | currency }}
      </span>
    </div>
    
    <div class="aspect-w-16 aspect-h-9 mb-4">
      <img 
        [src]="product.imageUrl" 
        [alt]="product.name"
        class="object-cover rounded-md">
    </div>
    
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      {{ product.description }}
    </p>
    
    <button 
      class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
      (click)="addToCart(product)">
      {{ 'ProductList.AddToCart' | translate }}
    </button>
  </div>
</div>
```

## 🔧 Component Features

### Layout Components

#### AppLayoutComponent
Main application layout with responsive design:

**Features:**
- Responsive sidebar navigation
- Top navigation bar
- Footer section
- Dark/light theme support
- Mobile-friendly hamburger menu

**Usage:**
```html
<app-layout>
  <router-outlet></router-outlet>
</app-layout>
```

#### AppTopbarComponent
Application header with navigation and user controls:

**Features:**
- Logo and branding
- Main navigation menu
- User authentication status
- Cart status indicator
- Language selector
- Dark mode toggle

#### AppSidebarComponent
Collapsible sidebar navigation:

**Features:**
- Category navigation
- User menu (when authenticated)
- Responsive behavior
- Touch-friendly mobile interface

#### AppFooterComponent
Application footer with links and information:

**Features:**
- Company information
- Quick links
- Social media links
- Copyright notice

### Navigation Components

#### AppMenuComponent
Dynamic navigation menu with role-based items:

**Features:**
- Dynamic menu generation
- Authentication-aware items
- Active route highlighting
- Internationalized labels

**Menu Structure:**
```typescript
export class AppMenuComponent {
  menuItems: MenuItem[] = [
    {
      label: this.translate.instant('Navigation.Homepage'),
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: this.translate.instant('Navigation.Categories'),
      icon: 'pi pi-list',
      items: this.generateCategoryItems()
    },
    {
      label: this.translate.instant('Navigation.OrderHistory'),
      icon: 'pi pi-history',
      routerLink: ['/orders'],
      visible: this.authFacade.isAuthenticated$
    }
  ];
}
```

#### AppMenuitemComponent
Individual menu item with sub-menu support:

**Features:**
- Nested menu support
- Active state management
- Click handling
- Icon support

### Product Components

#### AppProductListComponent
Product catalog with filtering and pagination:

**Features:**
- Grid/list view toggle
- Category filtering
- Search functionality
- Pagination
- Sort options
- Loading states
- Empty state handling

**Template Structure:**
```html
<div class="product-list">
  <!-- Filters -->
  <div class="filters">
    <app-category-filter 
      [categories]="categories$ | async"
      (categoryChange)="onCategoryChange($event)">
    </app-category-filter>
    
    <p-inputText 
      [(ngModel)]="searchQuery"
      placeholder="{{ 'ProductList.Search' | translate }}"
      (input)="onSearch($event)">
    </p-inputText>
  </div>

  <!-- Products -->
  <div *ngIf="loading$ | async" class="text-center">
    <p-progressSpinner></p-progressSpinner>
  </div>

  <p-dataView 
    [value]="products$ | async"
    [paginator]="true"
    [rows]="12"
    layout="grid">
    <ng-template pTemplate="gridItem" let-product>
      <app-product-card 
        [product]="product"
        (addToCart)="addToCart($event)"
        (viewDetails)="viewDetails($event)">
      </app-product-card>
    </ng-template>
  </p-dataView>
</div>
```

#### AppProductDetailsComponent
Detailed product view with purchase options:

**Features:**
- Product image gallery
- Detailed description
- Price display
- Quantity selector
- Add to cart functionality
- Related products
- Reviews section

### Shopping Cart Components

#### AppCartDetailsComponent
Full shopping cart management:

**Features:**
- Item list with images
- Quantity modification
- Item removal
- Price calculations
- Shipping information
- Checkout button
- Empty cart state

**Template Example:**
```html
<div class="cart-details">
  <h2>{{ 'Cart.Title' | translate }}</h2>
  
  <div *ngIf="(cartFacade.cartItems$ | async)?.length === 0" 
       class="empty-cart">
    <i class="pi pi-shopping-cart text-6xl text-gray-400"></i>
    <p>{{ 'Cart.EmptyCart' | translate }}</p>
    <a routerLink="/" class="p-button">
      {{ 'Cart.ContinueShopping' | translate }}
    </a>
  </div>

  <div *ngFor="let item of cartFacade.cartItems$ | async" 
       class="cart-item">
    <img [src]="item.product.imageUrl" [alt]="item.product.name">
    
    <div class="item-details">
      <h4>{{ item.product.name }}</h4>
      <p class="price">{{ item.product.price | currency }}</p>
    </div>
    
    <p-inputNumber 
      [(ngModel)]="item.quantity"
      [min]="1"
      [max]="99"
      (onInput)="updateQuantity(item.productId, $event.value)">
    </p-inputNumber>
    
    <button 
      class="p-button p-button-danger p-button-icon-only"
      (click)="removeItem(item.productId)">
      <i class="pi pi-trash"></i>
    </button>
  </div>

  <div class="cart-summary">
    <div class="total">
      <span>{{ 'Cart.TotalPrice' | translate }}:</span>
      <span class="amount">{{ cartFacade.totalPrice$ | async | currency }}</span>
    </div>
    
    <button 
      class="p-button p-button-lg w-full"
      routerLink="/checkout"
      [disabled]="(cartFacade.itemCount$ | async) === 0">
      {{ 'Cart.Checkout' | translate }}
    </button>
  </div>
</div>
```

#### AppCartStatusComponent
Compact cart summary for navigation:

**Features:**
- Item count badge
- Total price display
- Quick access to cart
- Responsive design

### Checkout Components

#### AppCheckoutComponent
Multi-step checkout process:

**Features:**
- Customer information form
- Shipping address form
- Billing address form
- Payment method selection
- Order review
- Form validation
- Progress indicator

**Form Structure:**
```typescript
export class AppCheckoutComponent implements OnInit {
  checkoutForm = this.fb.group({
    customer: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    }),
    shippingAddress: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', Validators.required]
    }),
    paymentInfo: this.fb.group({
      cardType: ['', Validators.required],
      nameOnCard: ['', Validators.required],
      cardNumber: ['', [Validators.required, this.cardValidator]],
      securityCode: ['', Validators.required],
      expirationMonth: ['', Validators.required],
      expirationYear: ['', Validators.required]
    })
  });

  // Validation with FluentValidation
  customerValidator = new CustomerValidator();
  addressValidator = new AddressValidator();
  paymentValidator = new PaymentValidator();
}
```

### User Management Components

#### AppLoginStatusComponent
User authentication status and controls:

**Features:**
- Login/logout buttons
- User avatar display
- Profile menu dropdown
- Loading states

#### AppProfilePageComponent
User profile management:

**Features:**
- Profile information display
- Edit profile form
- Password change
- Order history link
- Account deletion

### Utility Components

#### AppLanguageSelectorComponent
Language switching interface:

**Features:**
- Flag icons for languages
- Dropdown selection
- Current language display
- Smooth transitions

**Implementation:**
```typescript
export class AppLanguageSelectorComponent {
  currentLanguage$ = this.languageFacade.currentLanguage$;
  supportedLanguages$ = this.languageFacade.supportedLanguages$;

  constructor(public languageFacade: LanguageFacade) {}

  changeLanguage(languageCode: string) {
    this.languageFacade.setLanguage(languageCode);
  }
}
```

#### AppAuthCallbackComponent
Auth0 callback handler:

**Features:**
- Handles authentication redirect
- Processes auth tokens
- Redirects to intended page
- Error handling

## 🎯 Component Communication

### Parent-Child Communication

```typescript
// Parent Component
@Component({
  template: `
    <app-product-card 
      [product]="product"
      (addToCart)="onAddToCart($event)"
      (favorite)="onFavorite($event)">
    </app-product-card>
  `
})
export class ParentComponent {
  onAddToCart(product: Product) {
    this.cartFacade.addToCart(product);
  }

  onFavorite(product: Product) {
    this.favoritesFacade.toggleFavorite(product.id);
  }
}

// Child Component
@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <button (click)="addToCart.emit(product)">Add to Cart</button>
      <button (click)="favorite.emit(product)">Favorite</button>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() favorite = new EventEmitter<Product>();
}
```

### Service Communication via Facades

```typescript
// Component uses facades for state management
export class ProductListComponent {
  constructor(
    public productFacade: ProductFacade,
    public cartFacade: CartFacade,
    public authFacade: AuthFacade
  ) {}

  // Reactive data streams
  products$ = this.productFacade.products$;
  isAuthenticated$ = this.authFacade.isAuthenticated$;
  cartItemCount$ = this.cartFacade.itemCount$;
}
```

## 🎨 Styling and Theming

### Theme Integration

```scss
// Component-specific styles
.product-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-200 hover:shadow-lg;

  .product-image {
    @apply w-full h-48 object-cover rounded-md mb-4;
  }

  .product-title {
    @apply text-lg font-semibold text-gray-900 dark:text-white mb-2;
  }

  .product-price {
    @apply text-xl font-bold text-primary mb-4;
  }

  .add-to-cart-btn {
    @apply w-full bg-primary text-white py-2 px-4 rounded-md;
    @apply hover:bg-primary-dark transition-colors;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
  }
}

// Dark mode support
:host-context(.app-dark) {
  .product-card {
    @apply bg-gray-800 border-gray-700;
  }
}
```

### Responsive Design

```scss
// Mobile-first responsive design
.product-grid {
  @apply grid grid-cols-1 gap-4;
  
  @screen sm {
    @apply grid-cols-2 gap-6;
  }
  
  @screen md {
    @apply grid-cols-3;
  }
  
  @screen lg {
    @apply grid-cols-4;
  }
  
  @screen xl {
    @apply grid-cols-5;
  }
}
```

## 🧪 Component Testing

### Unit Testing

```typescript
describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productFacade: jasmine.SpyObj<ProductFacade>;

  beforeEach(() => {
    const productFacadeSpy = jasmine.createSpyObj('ProductFacade', [
      'loadProducts'
    ], {
      products$: of([mockProduct]),
      isLoading$: of(false),
      error$: of(null)
    });

    TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductFacade, useValue: productFacadeSpy }
      ]
    });

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productFacade = TestBed.inject(ProductFacade) as jasmine.SpyObj<ProductFacade>;
  });

  it('should load products on init', () => {
    component.ngOnInit();
    expect(productFacade.loadProducts).toHaveBeenCalled();
  });

  it('should display products', () => {
    fixture.detectChanges();
    
    const productElements = fixture.debugElement.queryAll(
      By.css('.product-card')
    );
    
    expect(productElements).toHaveLength(1);
  });
});
```

### Integration Testing

```typescript
describe('CheckoutComponent Integration', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CheckoutComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        provideMockStore({ initialState: mockAppState })
      ]
    });

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  it('should validate form before submission', () => {
    component.checkoutForm.patchValue({
      customer: { firstName: '', email: 'invalid-email' }
    });

    component.onSubmit();

    expect(component.checkoutForm.valid).toBeFalse();
    expect(component.checkoutForm.get('customer.firstName')?.errors).toBeTruthy();
  });
});
```

## 📱 Accessibility

### ARIA Support

```html
<div class="product-list" 
     role="main"
     aria-label="{{ 'ProductList.Title' | translate }}">
  
  <h2 id="products-heading">{{ 'ProductList.Title' | translate }}</h2>
  
  <div class="product-grid" 
       role="grid"
       aria-labelledby="products-heading">
    
    <div *ngFor="let product of products$ | async; trackBy: trackByProductId"
         class="product-card"
         role="gridcell"
         [attr.aria-label]="product.name + ', ' + (product.price | currency)">
      
      <img [src]="product.imageUrl" 
           [alt]="'Product image for ' + product.name">
      
      <h3 [id]="'product-title-' + product.id">{{ product.name }}</h3>
      
      <button type="button"
              class="add-to-cart-btn"
              [attr.aria-describedby]="'product-title-' + product.id"
              (click)="addToCart(product)">
        {{ 'ProductList.AddToCart' | translate }}
      </button>
    </div>
  </div>
</div>
```

### Keyboard Navigation

```typescript
export class ProductCardComponent {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.addToCart.emit(this.product);
    }
  }
}
```

## 🔗 Related Documentation

- [Store Documentation](../store/README.md) - State management
- [Facades Documentation](../facades/README.md) - Component-facade integration
- [Services Documentation](../services/README.md) - Business logic services
- [Validators Documentation](../validators/README.md) - Form validation

## 📝 Best Practices

- Use OnPush change detection for better performance
- Implement proper accessibility features (ARIA, keyboard navigation)
- Use reactive patterns with async pipe
- Handle loading and error states in templates
- Write comprehensive unit and integration tests
- Follow consistent naming conventions
- Use TypeScript strict mode
- Implement proper SEO with meta tags
- Optimize images and assets
- Use lazy loading for better performance
