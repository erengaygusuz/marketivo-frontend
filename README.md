# Marketivo Frontend

A modern, scalable Angular e-commerce application built with cutting-edge technologies and best practices. This application features comprehensive state management, internationalization, authentication, validation, and a robust development workflow.

## 🎯 Project Goal and Scope

### Project Type
- **Personal Project** (currently maintained by a single developer)  
- Designed with scalability and team collaboration in mind

### Team & Roles
- **Team Size**: 1 Developer (full-stack & DevOps responsibilities)  
- **Potential Expansion**: Future-ready for designers, QA engineers, and backend contributors

### Duration
- **Start Date**: August 2025  
- **Current Status**: In active development  
- **Planned v1.0 Release**: Q4 2025  

### Methodologies
- **Development Approach**: Agile-inspired, iterative releases  
- **Task Management**: [Trello Board](https://trello.com/b/AYQPIdZ0/marketivo)  
- **Branching Strategy**: Single main branch with direct commits  
- **Code Reviews**: Self-review with automated linting & quality checks  

This project is a modern e-commerce platform designed to provide a seamless online shopping experience. The application enables users to:

- Browse and search through product catalogs across multiple categories
- Add products to shopping cart and manage cart items
- Complete secure checkout process with Stripe payment integration
- View order history and track order status
- Manage user profiles and account settings
- Experience fully internationalized interface (English and Turkish)
- Enjoy responsive design across all devices

**Live Demo**: [marketivo.erengaygusuz.com.tr](https://marketivo.erengaygusuz.com.tr)

## 👥 User Roles and Features

The application supports two main user types with specific capabilities:

| Feature | Guest User | Authenticated User |
|---------|------------|-------------------|
| Browse products | ✅ | ✅ |
| View product details | ✅ | ✅ |
| Search and filter products | ✅ | ✅ |
| Add to cart | ✅ | ✅ |
| Checkout process | ❌ | ✅ |
| Order history | ❌ | ✅ |
| Profile management | ❌ | ✅ |
| Language switching | ✅ | ✅ |
| Dark/Light mode toggle | ✅ | ✅ |

## 🚀 Features

### Core Technologies
- **Angular 20** - Latest Angular framework with standalone components
- **TypeScript** - Type-safe development
- **SCSS** - Enhanced styling capabilities
- **TailwindCSS v4** - Utility-first CSS framework with PrimeNG integration
- **PrimeNG** - Comprehensive UI component library with Aura theme

### Architecture & State Management
- **NgRx Store** - Predictable state management with actions, reducers, and effects
- **Facade Pattern** - Clean abstraction layer between components and store
- **Reactive Programming** - RxJS for handling asynchronous operations
- **Modular Architecture** - Well-organized folder structure with clear separation of concerns
- **Component-Based Design** - Reusable, maintainable UI components

### Authentication & Security
- **Auth0 Integration** - Secure authentication and authorization
- **JWT Token Management** - Automatic token handling with interceptors
- **Protected Routes** - Route guards for secure navigation with authorization-protected endpoints
- **HTTP Interceptors** - Automatic request/response processing
- **Role-Based Access Control** - Different permissions for guest and authenticated users

### E-commerce Features
- **Product Catalog** - Browse products by categories with search and filtering
- **Shopping Cart** - Add, remove, and manage cart items with persistent storage
- **Stripe Integration** - Secure payment processing with multiple payment methods
- **Order Management** - Complete order tracking and history
- **Responsive Design** - Mobile-first approach with responsive layouts
- **SEO Optimization** - Search engine friendly structure

### Internationalization (i18n)
- **Multi-language Support** - English and Turkish translations
- **Dynamic Language Switching** - Runtime language changes
- **Localized Content** - Complete UI translation support
- **Server-side Configuration** - Environment-based language configuration
- **RTL Support Ready** - Right-to-left language support preparation

### Validation & Forms
- **FluentValidation-TS** - Powerful TypeScript validation library
- **Reactive Forms** - Angular reactive forms with custom validators
- **Real-time Validation** - Instant feedback on user input
- **Internationalized Error Messages** - Localized validation messages
- **Custom Validators** - Business-specific validation rules

### Performance & Optimization
- **Lazy Loading** - Route-based code splitting for faster load times
- **OnPush Change Detection** - Optimized change detection strategy
- **Tree Shaking** - Dead code elimination for smaller bundles
- **Service Workers** - Offline support and caching strategies
- **Image Optimization** - Responsive images and lazy loading

### Development Workflow
- **ESLint** - Advanced code linting with TypeScript support
- **Prettier** - Automated code formatting
- **Code Quality Checks** - Pre-build validation scripts
- **Development Certificates** - HTTPS support for local development
- **Hot Reload** - Fast development with live updates
- **Source Maps** - Enhanced debugging experience

### Deployment & DevOps
- **Docker Support** - Multi-stage Docker builds with Nginx
- **Nginx Configuration** - Production-ready web server setup
- **Server-side Configuration** - Runtime environment variable injection
- **Multiple Environments** - Development, staging, and production configs
- **CI/CD Ready** - Prepared for continuous integration workflows
- **Health Checks** - Application monitoring and status endpoints

## 📋 Prerequisites

- **Node.js** (v20 or higher)
- **npm** (v9 or higher)
- **Docker** (for containerized deployment)
- **Git** (for version control)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketivo-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The application uses server-side configuration for environment variables. Configure these variables in your deployment environment:
   
   - `PROD` - Production flag (true/false)
   - `API_ADDRESS` - Backend API base URL
   - `STRIPE_PK` - Stripe publishable key
   - `AUTH_DOMAIN` - Auth0 domain
   - `AUTH_CLIENT_ID` - Auth0 client ID
   - `AUTH_AUDIENCE` - Auth0 API audience
   - `DEFAULT_LANG` - Default language (en-US, tr-TR)
   - `SUPPORTED_LANGS` - Comma-separated supported languages

## 🎯 Development

### Available Scripts

#### Development Commands
```bash
# Start development server with code quality checks
npm run start

# Start development server without checks (faster)
npm run start:no-check

# Start with HTTPS (recommended for Auth0)
npm run dev

# Start staging environment
npm run stage

# Start production environment locally
npm run prod
```

#### Code Quality Commands
```bash
# Format and lint code
npm run code:fix

# Check code quality without fixing
npm run code:check

# Strict code quality check (no warnings allowed)
npm run code:check:strict

# Format code only
npm run format

# Lint code only
npm run lint
```

#### Build Commands
```bash
# Production build with code quality checks
npm run build

# Production build without checks
npm run build:no-check

# Watch mode for development
npm run watch
```

#### Testing
```bash
# Run unit tests
npm test
```

### Development Workflow

1. **Code Quality**: Every build and start command runs code quality checks by default
2. **HTTPS Development**: Use `npm run dev` for HTTPS development (required for Auth0)
3. **Environment Switching**: Use different commands for different environments
4. **Hot Reload**: Changes are automatically reflected in the browser

### Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── app-auth-callback/      # Auth0 callback handler
│   │   ├── app-cart-details/       # Shopping cart management
│   │   ├── app-cart-status/        # Cart status indicator
│   │   ├── app-checkout/           # Checkout process
│   │   ├── app-footer/             # Application footer
│   │   ├── app-language-selector/  # Language switching
│   │   ├── app-layout/             # Main layout wrapper
│   │   ├── app-login-status/       # Authentication status
│   │   ├── app-menu/               # Navigation menu
│   │   ├── app-menuitem/           # Menu item component
│   │   ├── app-order-history/      # Order history display
│   │   ├── app-product-details/    # Product detail view
│   │   ├── app-product-list/       # Product catalog
│   │   ├── app-profile-page/       # User profile management
│   │   ├── app-sidebar/            # Sidebar navigation
│   │   └── app-topbar/             # Top navigation bar
│   ├── facades/             # State management facades
│   │   ├── auth.facade.ts          # Authentication state
│   │   ├── cart.facade.ts          # Shopping cart state
│   │   ├── checkout.facade.ts      # Checkout process state
│   │   ├── language.facade.ts      # Language settings state
│   │   ├── order-history.facade.ts # Order history state
│   │   └── product.facade.ts       # Product catalog state
│   ├── interceptors/        # HTTP interceptors
│   │   ├── auth-interceptor.ts     # JWT token injection
│   │   └── language-interceptor.ts # Language header injection
│   ├── models/              # TypeScript interfaces and types
│   │   ├── address-data.ts         # Address form data
│   │   ├── auth-info.ts            # Authentication info
│   │   ├── cart-item.ts            # Shopping cart item
│   │   ├── customer.ts             # Customer information
│   │   ├── order.ts                # Order information
│   │   ├── product.ts              # Product information
│   │   └── ...                     # Additional models
│   ├── services/            # Business logic services
│   │   └── ...                     # API and business services
│   ├── store/               # NgRx store (actions, reducers, effects)
│   │   └── ...                     # Store configuration
│   ├── validators/          # Form validation logic
│   │   └── ...                     # Custom validators
│   └── config/              # Application configuration
│       └── custom-config.ts        # Environment configuration
├── assets/                  # Static assets and styles
│   ├── styles.scss                 # Global styles
│   ├── tailwind.css               # TailwindCSS imports
│   └── layout/                     # Layout-specific styles
├── environments/            # Environment configurations
│   ├── environment.ts              # Production environment
│   ├── environment.development.ts  # Development environment
│   ├── environment.staging.ts      # Staging environment
│   └── environment.interface.ts    # Environment interface
└── public/                  # Public assets and i18n files
    ├── i18n/                       # Internationalization files
    │   ├── en-US.json              # English translations
    │   └── tr-TR.json              # Turkish translations
    └── images/                     # Static images
        ├── logo.png                # Application logo
        └── products/               # Product images
```

## 🛠️ Tools and Technologies

### Core Framework and Language
- **Angular**: ^20.0.0 - Latest Angular framework with standalone components
- **TypeScript**: ^5.7.0 - Strongly typed JavaScript superset
- **RxJS**: ^7.8.0 - Reactive Extensions for JavaScript

### UI Framework and Styling
- **PrimeNG**: ^20.3.0 - Comprehensive Angular UI component library
- **PrimeFlex**: ^3.3.1 - CSS utility library for flexbox
- **PrimeIcons**: ^7.0.0 - Icon library for PrimeNG
- **@primeuix/themes**: ^1.2.1 - Modern theming system
- **TailwindCSS**: v4 - Utility-first CSS framework
- **FontAwesome**: ^6.7.2 - Icon library

### State Management
- **@ngrx/store**: ^20.0.0 - State management library
- **@ngrx/effects**: ^20.0.0 - Side effects management
- **@ngrx/store-devtools**: ^20.0.0 - Development tools for NgRx

### Authentication and Security
- **@auth0/auth0-angular**: ^2.2.3 - Auth0 integration for Angular
- **JWT handling**: Built-in JWT token management

### Internationalization
- **@ngx-translate/core**: ^17.0.0 - Angular internationalization
- **@ngx-translate/http-loader**: ^17.0.0 - HTTP loader for translations

### Payment Processing
- **@stripe/stripe-js**: ^7.8.0 - Stripe payment integration

### Development Tools
- **@angular/cli**: Latest - Angular command line interface
- **ESLint**: Latest - Code linting and quality assurance
- **Prettier**: Latest - Code formatting
- **TypeScript ESLint**: Latest - TypeScript-specific linting rules

### Validation
- **FluentValidation-TS**: Latest - TypeScript validation library
- **Angular Reactive Forms**: Built-in form validation

### Build and Deployment
- **@angular-architects/native-federation**: Module federation support
- **NGSSC**: Server-side configuration for Angular
- **Docker**: Multi-stage containerization
- **Nginx**: Production web server

### Development Dependencies
- **@angular-devkit/build-angular**: Latest - Angular build tools
- **Karma**: Latest - Test runner
- **Jasmine**: Latest - Testing framework

## 🏗️ Architecture

### State Management (NgRx)

The application uses NgRx for centralized state management with the following structure:

- **Actions**: Define what can happen in the application
- **Reducers**: Pure functions that handle state changes
- **Effects**: Handle side effects like API calls
- **Selectors**: Query the store for specific data
- **Facades**: Provide a clean API for components

### Facade Pattern

Facades abstract the complexity of NgRx store operations:

```typescript
// Example: AuthFacade usage
constructor(private authFacade: AuthFacade) {}

ngOnInit() {
  this.isAuthenticated$ = this.authFacade.isAuthenticated$;
  this.user$ = this.authFacade.user$;
}

login() {
  this.authFacade.login();
}
```

### Validation System

FluentValidation-TS provides powerful, composable validation:

```typescript
// Example: Form validation
export class CustomerValidator extends Validator<CustomerData> {
  constructor() {
    super();
    this.ruleFor('email')
      .notEmpty()
      .withMessage('Validation.EmailRequired')
      .emailAddress()
      .withMessage('Validation.EmailFormat');
  }
}
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t marketivo-frontend .
```

### Run Container
```bash
docker run -p 80:80 \
  -e PROD=true \
  -e API_ADDRESS=https://api.marketivo.com \
  -e STRIPE_PK=pk_live_your_stripe_key \
  -e AUTH_DOMAIN=your-auth0-domain \
  -e AUTH_CLIENT_ID=your-auth0-client-id \
  -e AUTH_AUDIENCE=your-auth0-audience \
  marketivo-frontend
```

### Docker Compose Example
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - PROD=true
      - API_ADDRESS=https://api.marketivo.com
      - STRIPE_PK=pk_live_your_stripe_key
      - AUTH_DOMAIN=your-auth0-domain
      - AUTH_CLIENT_ID=your-auth0-client-id
      - AUTH_AUDIENCE=your-auth0-audience
      - DEFAULT_LANG=en-US
      - SUPPORTED_LANGS=en-US,tr-TR
```

## 🌐 Internationalization

### Adding New Languages

1. **Create translation file**: `public/i18n/{language-code}.json`
2. **Update environment**: Add language code to `SUPPORTED_LANGS`
3. **Translation structure**:
   ```json
   {
     "Navigation": {
       "Homepage": "Home"
     },
     "Validation": {
       "EmailRequired": "Email is required"
     }
   }
   ```

### Using Translations in Components

```typescript
// In component
constructor(private translate: TranslateService) {}

ngOnInit() {
  this.title = this.translate.instant('Navigation.Homepage');
}
```

```html
<!-- In template -->
<h1>{{ 'Navigation.Homepage' | translate }}</h1>
```

## 🔧 Configuration

### Environment Variables

The application supports runtime configuration through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PROD` | Production mode | `false` |
| `API_ADDRESS` | Backend API URL | `/api` |
| `STRIPE_PK` | Stripe publishable key | Test key |
| `AUTH_DOMAIN` | Auth0 domain | Default domain |
| `AUTH_CLIENT_ID` | Auth0 client ID | Default client |
| `AUTH_AUDIENCE` | Auth0 API audience | Default audience |
| `DEFAULT_LANG` | Default language | `en-US` |
| `SUPPORTED_LANGS` | Supported languages | `en-US,tr-TR` |

### SSL Certificates

For local HTTPS development, certificates are provided in the `certs/` directory:
- `localhost.crt` - SSL certificate
- `localhost.key` - Private key

## 🧪 Testing

### Unit Testing
Unit tests are not currently implemented but are planned for future development.

```bash
# Unit tests will be available in future versions
# npm test
```

### Code Quality Testing
```bash
npm run code:check:strict
```

## 📦 Build Process

The build process includes:

1. **Code Quality Check** - ESLint and Prettier validation
2. **TypeScript Compilation** - Type checking and compilation
3. **Angular Build** - Application bundling and optimization
4. **NGSSC Integration** - Server-side configuration setup
5. **Asset Optimization** - Minification and compression

## 🤝 Contributing

As this is currently a personal project developed by a single developer, contributions are welcome but managed differently than typical open-source projects:

### Current Development Process
- **Solo Development**: Currently developed and maintained by [Eren Gaygusuz](https://github.com/erengaygusuz)
- **Task Management**: Progress tracked on [Trello Board](https://trello.com/b/AYQPIdZ0/marketivo)
- **Single Branch**: Direct commits to main branch with thorough testing
- **Quality Assurance**: Automated linting, formatting, and manual testing

### How to Contribute
1. **Check the Trello Board** to see current tasks and priorities
2. **Open an Issue** to discuss your proposed contribution
3. **Fork the repository** and create your feature branch
4. **Follow the development guidelines** outlined below
5. **Submit a Pull Request** with detailed description

### Development Guidelines
- **Follow the existing code style** and architecture patterns
- **Write meaningful commit messages** following conventional commits
- **Add tests** for new features when applicable
- **Update documentation** for significant changes
- **Run code quality checks** before committing:
  ```bash
  npm run code:check:strict
  ```

### Code Standards
- **ESLint**: Follow the configured ESLint rules (no warnings allowed in strict mode)
- **Prettier**: Code formatting is automatically enforced
- **TypeScript**: Strict typing is required - no `any` types
- **Angular Style Guide**: Follow official Angular style guidelines
- **Component Architecture**: Use standalone components and signals where appropriate
- **State Management**: Use facades for component-store interaction

### Commit Guidelines
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

### Pull Request Process
1. **Ensure all tests pass** and code quality checks succeed
2. **Update the README.md** if you've made significant changes
3. **Reference related Trello cards** in your PR description
4. **Request a review** from the maintainer
5. **Address feedback** promptly and professionally

### Testing
```bash
# Unit tests (planned for future implementation)
# npm test

# Run code quality checks
npm run code:check:strict

# Run full build to ensure everything works
npm run build
```

### Questions or Issues?
- Check the [Trello Board](https://trello.com/b/AYQPIdZ0/marketivo) for current development status
- Check existing [GitHub issues](https://github.com/erengaygusuz/marketivo-frontend/issues) first
- Create a new issue with detailed information for bugs or feature requests
- Contact the developer through GitHub for questions

## 📸 Screenshots

*Screenshots will be added as the application develops*

### Homepage
*Coming soon*

### Product Catalog
*Coming soon*

### Shopping Cart
*Coming soon*

### Checkout Process
*Coming soon*

### User Profile
*Coming soon*

### Admin Dashboard
*Coming soon*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This means you are free to:
- Use the software for any purpose
- Change the software to suit your needs
- Share the software with your friends and neighbors
- Share the changes you make

## 🚀 Performance Optimization

### Bundle Optimization
- **Tree Shaking**: Dead code elimination
- **Code Splitting**: Route-based lazy loading
- **Compression**: Gzip and Brotli compression
- **Minification**: Production builds are minified

### Runtime Performance
- **OnPush Change Detection**: Optimized change detection
- **Signals**: Modern reactivity where applicable
- **Virtual Scrolling**: For large lists
- **Image Optimization**: Responsive images and lazy loading

### SEO and Accessibility
- **Server-Side Rendering**: Ready for SSR implementation
- **Meta Tags**: Dynamic meta tag management
- **Structured Data**: Schema.org markup
- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support

## 🔒 Security Features

- **Content Security Policy**: CSP headers configured
- **HTTPS Only**: Secure communication enforced
- **JWT Token Security**: Secure token handling
- **XSS Protection**: Built-in Angular XSS protection
- **CSRF Protection**: Cross-site request forgery protection
- **Input Sanitization**: All user inputs are sanitized

## 🌍 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## 📱 Mobile Support

- **Responsive Design**: Mobile-first approach
- **Touch Gestures**: Touch-friendly interactions
- **Progressive Web App**: PWA capabilities ready
- **Offline Support**: Service worker integration ready

## 📞 Support and Community

### Getting Help
- **Documentation**: Check this README and related docs first
- **Task Management**: Track progress on [Trello Board](https://trello.com/b/AYQPIdZ0/marketivo)
- **Issues**: Use GitHub issues for critical bug reports
- **Direct Contact**: Reach out through GitHub profile

### Contact Information
- **Developer**: [Eren Gaygusuz](https://github.com/erengaygusuz)
- **Project Board**: [Marketivo Trello](https://trello.com/b/AYQPIdZ0/marketivo)
- **Repository**: [GitHub Repository](https://github.com/erengaygusuz/marketivo-frontend)

### Community Guidelines
- This is a personal project with open contribution opportunities
- Be respectful and constructive in all interactions
- Provide detailed information when reporting issues
- Check the Trello board before suggesting new features
- Help improve documentation and code quality

## 🏆 Acknowledgments

- **Angular Team** - For the amazing framework
- **PrimeNG Team** - For the comprehensive UI library
- **NgRx Team** - For the powerful state management solution
- **Auth0** - For secure authentication services
- **Stripe** - For payment processing integration
- **Open Source Community** - For the incredible ecosystem

## 📈 Roadmap

### Version 1.1 (Planned)
- 📋 **Adding Unit Tests** - Implement comprehensive unit testing for all components and services
- 📋 **Global Error Handler** - Centralized error handling and user-friendly error messages
- 📋 **Keycloak Integration** - Replace Auth0 with Keycloak for authentication and authorization

### Version 1.2 (Future)
- 🔮 **Product Image Zoom** - Adding zoom-in/zoom-out functionality for product images
- 🔮 **Advanced Product Filters** - Detailed filtering options for product list (price range, ratings, etc.)
- 🔮 **Dynamic Object Mapping** - Using dynamic-mapper for efficient object mapping
- 🔮 **Multi-language Auth Pages** - Extend internationalization to authentication pages
- 🔮 **Shipping Integration** - Using Karrio API for shipping calculations and tracking
- 🔮 **CI/CD Pipeline** - Using Jenkins for automated deployment pipeline

### Version 2.0 (Long-term)
- 🌟 **Mobile Application** - Native mobile app development
- 🌟 **AI Recommendations** - Advanced AI-powered product recommendations
- 🌟 **Microservices Architecture** - Migration to microservices-based backend
- 🌟 **Advanced Reporting** - Comprehensive analytics and reporting systemtive development

---

<div align="center">

**🛒 Marketivo Frontend - Modern E-commerce Experience**

Built with ❤️ using Angular 20, NgRx, PrimeNG, and modern web technologies

[![Angular](https://img.shields.io/badge/Angular-20-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-20-purple)](https://primeng.org/)
[![NgRx](https://img.shields.io/badge/NgRx-20-orange)](https://ngrx.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-teal)](https://tailwindcss.com/)

[🏠 Homepage](https://github.com/erengaygusuz/marketivo-frontend) • 
[📚 Documentation](./README.md) • 
[🐛 Report Bug](https://github.com/erengaygusuz/marketivo-frontend/issues) • 
[💡 Request Feature](https://github.com/erengaygusuz/marketivo-frontend/issues)

**Made with passion for modern web development**

</div>
