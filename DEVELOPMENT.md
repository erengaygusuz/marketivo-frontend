# Development Guide

This guide provides comprehensive information for developers working on the Marketivo Frontend application, including setup, development workflows, coding standards, and best practices.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "angular.ng-template",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-docker",
    "github.copilot"
  ]
}
```

### Project Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketivo-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   - HTTP: http://localhost:4200
   - HTTPS: https://localhost:4200 (recommended for Auth0)

## 📁 Project Structure

### High-Level Overview

```
marketivo-frontend/
├── src/                     # Source code
│   ├── app/                 # Angular application
│   │   ├── components/      # UI components
│   │   ├── facades/         # State management facades
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # TypeScript interfaces
│   │   ├── services/        # Business logic services
│   │   ├── store/           # NgRx state management
│   │   ├── validators/      # Form validation
│   │   └── config/          # Application configuration
│   ├── assets/              # Static assets and styles
│   ├── environments/        # Environment configurations
│   └── public/              # Public assets and i18n files
├── scripts/                 # Build and utility scripts
├── certs/                   # SSL certificates for development
├── docs/                    # Project documentation
└── docker/                  # Docker configuration files
```

### Detailed Structure

```
src/app/
├── components/
│   ├── app-layout/
│   │   ├── app-layout.component.ts
│   │   ├── app-layout.component.html
│   │   └── app-layout.component.scss
│   ├── app-product-list/
│   └── ... (other components)
├── facades/
│   ├── auth.facade.ts
│   ├── cart.facade.ts
│   └── ... (other facades)
├── models/
│   ├── product.ts
│   ├── user.ts
│   └── ... (other models)
├── services/
│   ├── product.service.ts
│   ├── cart.service.ts
│   └── ... (other services)
├── store/
│   ├── auth/
│   │   ├── auth.actions.ts
│   │   ├── auth.reducer.ts
│   │   ├── auth.effects.ts
│   │   ├── auth.selectors.ts
│   │   └── auth.state.ts
│   └── ... (other feature stores)
└── validators/
    └── checkout-form.validator.ts
```

## 🛠️ Development Workflow

### Daily Development

1. **Start development server**
   ```bash
   npm run dev  # With HTTPS and code quality checks
   # or
   npm run dev:no-check  # Skip code quality checks for faster startup
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Code quality checks**
   ```bash
   npm run code:check  # Check formatting and linting
   npm run code:fix    # Fix formatting and linting issues
   ```

### Branch Strategy

We follow the GitFlow branching model:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes
- `release/*` - Release preparation branches

### Feature Development Workflow

1. **Create feature branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

3. **Run quality checks**
   ```bash
   npm run code:check:strict
   npm test
   ```

4. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Build process or auxiliary tool changes

**Examples:**
```bash
git commit -m "feat(auth): add social login support"
git commit -m "fix(cart): resolve quantity update issue"
git commit -m "docs: update deployment guide"
```

## 🎨 Coding Standards

### TypeScript Guidelines

#### 1. Use Strict Type Checking

```typescript
// ✅ Good: Strong typing
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Observable<User> {
  return this.http.get<User>(`/api/users/${id}`);
}

// ❌ Avoid: Any types
function getUser(id: any): any {
  return this.http.get(`/api/users/${id}`);
}
```

#### 2. Use Interfaces for Data Structures

```typescript
// ✅ Good: Clear interfaces
export interface Product {
  readonly id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  imageUrl: string;
  inStock: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  categoryId: string;
}
```

#### 3. Use Enums for Constants

```typescript
// ✅ Good: Type-safe enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Usage
const order: Order = {
  id: '123',
  status: OrderStatus.PENDING
};
```

### Angular Component Guidelines

#### 1. Use OnPush Change Detection

```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class ProductListComponent {
  // Component implementation
}
```

#### 2. Implement Lifecycle Interfaces

```typescript
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.productFacade.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### 3. Use Reactive Patterns

```typescript
// ✅ Good: Reactive patterns with async pipe
@Component({
  template: `
    <div *ngFor="let product of products$ | async">
      {{ product.name }}
    </div>
    <div *ngIf="loading$ | async">Loading...</div>
    <div *ngIf="error$ | async as error">{{ error }}</div>
  `
})
export class ProductListComponent {
  products$ = this.productFacade.products$;
  loading$ = this.productFacade.isLoading$;
  error$ = this.productFacade.error$;

  constructor(public productFacade: ProductFacade) {}
}

// ❌ Avoid: Imperative patterns
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
```

### CSS/SCSS Guidelines

#### 1. Use TailwindCSS Classes

```html
<!-- ✅ Good: Utility-first approach -->
<div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
    {{ product.name }}
  </h3>
  <span class="text-xl font-bold text-primary">
    {{ product.price | currency }}
  </span>
</div>

<!-- ❌ Avoid: Custom CSS for common layouts -->
<div class="product-header">
  <h3 class="product-title">{{ product.name }}</h3>
  <span class="product-price">{{ product.price | currency }}</span>
</div>

<style>
.product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  /* ... more custom CSS */
}
</style>
```

#### 2. Component-Specific Styles

```scss
// ✅ Good: Component-scoped styles for complex components
.product-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-200 hover:shadow-lg;

  &__image {
    @apply w-full h-48 object-cover rounded-md mb-4;
  }

  &__title {
    @apply text-lg font-semibold text-gray-900 dark:text-white mb-2;
  }

  &__price {
    @apply text-xl font-bold text-primary mb-4;
  }

  &--featured {
    @apply border-primary shadow-lg;
  }
}
```

#### 3. Responsive Design

```html
<!-- ✅ Good: Mobile-first responsive design -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
  <div class="product-card">
    <!-- Product content -->
  </div>
</div>
```

## 🧪 Testing Standards

### Unit Testing

#### Component Testing

```typescript
describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productFacade: jasmine.SpyObj<ProductFacade>;

  beforeEach(async () => {
    const productFacadeSpy = jasmine.createSpyObj('ProductFacade', [
      'loadProducts'
    ], {
      products$: of([mockProduct]),
      isLoading$: of(false),
      error$: of(null)
    });

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductFacade, useValue: productFacadeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productFacade = TestBed.inject(ProductFacade) as jasmine.SpyObj<ProductFacade>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    component.ngOnInit();
    expect(productFacade.loadProducts).toHaveBeenCalled();
  });

  it('should display products', () => {
    fixture.detectChanges();
    
    const productElements = fixture.debugElement.queryAll(
      By.css('[data-testid="product-card"]')
    );
    
    expect(productElements).toHaveLength(1);
  });
});
```

#### Service Testing

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
      { id: '1', name: 'Test Product', price: 100 }
    ];

    service.getProducts().subscribe(response => {
      expect(response.content).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service.apiUrl}?page=0&size=20`);
    expect(req.request.method).toBe('GET');
    req.flush({ content: mockProducts });
  });
});
```

### Integration Testing

```typescript
describe('Checkout Flow Integration', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CheckoutComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        provideMockStore({ initialState: mockAppState })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  it('should complete checkout flow', fakeAsync(() => {
    // Fill out form
    component.checkoutForm.patchValue({
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      },
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'US',
        zipCode: '12345'
      }
    });

    // Submit form
    component.onSubmit();
    tick();

    // Verify form is valid and submitted
    expect(component.checkoutForm.valid).toBeTrue();
    expect(component.isSubmitted).toBeTrue();
  }));
});
```

### E2E Testing Guidelines

```typescript
// e2e/product-list.e2e-spec.ts
describe('Product List Page', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should display products', () => {
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="product-name"]').first().should('be.visible');
    cy.get('[data-testid="product-price"]').first().should('be.visible');
  });

  it('should add product to cart', () => {
    cy.get('[data-testid="add-to-cart-btn"]').first().click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });

  it('should filter by category', () => {
    cy.get('[data-testid="category-filter"]').select('books');
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
    cy.url().should('include', 'category=books');
  });
});
```

## 🔧 Development Tools

### Code Quality Scripts

```bash
# Run all quality checks
npm run code:check:strict

# Fix formatting and linting
npm run code:fix

# Check formatting only
npm run format:check

# Fix formatting only
npm run format

# Check linting only
npm run lint:check

# Fix linting only
npm run lint
```

### Development Server Options

```bash
# Standard development with checks
npm run start

# Development without checks (faster)
npm run start:no-check

# HTTPS development (recommended for Auth0)
npm run dev

# Staging environment
npm run stage

# Production mode locally
npm run prod
```

### Build Options

```bash
# Production build with checks
npm run build

# Production build without checks
npm run build:no-check

# Watch mode for development
npm run watch
```

## 🚀 Performance Guidelines

### Bundle Optimization

#### 1. Lazy Loading

```typescript
// ✅ Good: Lazy load feature modules
const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./components/app-product-list/app-product-list.component')
      .then(m => m.AppProductListComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./components/app-order-history/app-order-history.component')
      .then(m => m.AppOrderHistoryComponent),
    canActivate: [authGuard]
  }
];
```

#### 2. Tree Shaking

```typescript
// ✅ Good: Import only what you need
import { map, filter, switchMap } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';

// ❌ Avoid: Importing entire libraries
import * as rxjs from 'rxjs';
import * as primeng from 'primeng';
```

### Component Optimization

#### 1. OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  // Use immutable data and observables
}
```

#### 2. TrackBy Functions

```typescript
// ✅ Good: TrackBy for large lists
@Component({
  template: `
    <div *ngFor="let item of items; trackBy: trackByItemId">
      {{ item.name }}
    </div>
  `
})
export class ListComponent {
  trackByItemId(index: number, item: any): string {
    return item.id;
  }
}
```

### Image Optimization

```html
<!-- ✅ Good: Optimized images -->
<img 
  [src]="product.imageUrl" 
  [alt]="product.name"
  loading="lazy"
  class="w-full h-48 object-cover rounded-md">

<!-- ✅ Good: Responsive images -->
<picture>
  <source media="(min-width: 768px)" [srcset]="product.largeImageUrl">
  <source media="(min-width: 480px)" [srcset]="product.mediumImageUrl">
  <img [src]="product.smallImageUrl" [alt]="product.name" loading="lazy">
</picture>
```

## 🐛 Debugging

### Browser DevTools

1. **Angular DevTools**
   - Install Angular DevTools extension
   - Inspect component tree and state
   - Profile change detection

2. **Redux DevTools**
   - Install Redux DevTools extension
   - Monitor NgRx state changes
   - Time travel debugging

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

### Common Issues and Solutions

#### 1. CORS Issues

```typescript
// Development proxy configuration
// angular.json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}

// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

#### 2. Memory Leaks

```typescript
// ✅ Good: Proper subscription cleanup
export class ComponentWithSubscriptions implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## 📚 Learning Resources

### Angular Documentation
- [Angular Official Docs](https://angular.io/docs)
- [Angular CLI Reference](https://angular.io/cli)
- [Angular Best Practices](https://angular.io/guide/styleguide)

### NgRx Documentation
- [NgRx Official Docs](https://ngrx.io/docs)
- [NgRx Best Practices](https://ngrx.io/guide/store/why#principles)

### Libraries Used
- [PrimeNG Documentation](https://primeng.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Auth0 Angular SDK](https://auth0.com/docs/quickstart/spa/angular)
- [FluentValidation-TS](https://github.com/AlexJPotter/fluentvalidation-ts)

## 🤝 Contributing

### Pull Request Process

1. **Create feature branch** from `develop`
2. **Make changes** following coding standards
3. **Add/update tests** for new functionality
4. **Run quality checks** (`npm run code:check:strict`)
5. **Update documentation** if needed
6. **Create pull request** with clear description
7. **Address review feedback**
8. **Merge** after approval

### Code Review Checklist

- [ ] Code follows TypeScript and Angular best practices
- [ ] Components use OnPush change detection
- [ ] Proper error handling is implemented
- [ ] Tests are added/updated
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Accessibility considerations are addressed
- [ ] Performance implications are considered

## 🔗 Related Documentation

- [Main README](../README.md) - Project overview
- [Deployment Guide](../DEPLOYMENT.md) - Deployment instructions
- [Store Documentation](../src/app/store/README.md) - State management
- [Components Documentation](../src/app/components/README.md) - UI components
- [Services Documentation](../src/app/services/README.md) - Business logic

---

**Happy coding! 🚀**
