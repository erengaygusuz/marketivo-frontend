# Marketivo Frontend

A modern, scalable Angular e-commerce application built with cutting-edge technologies and best practices. This application features comprehensive state management, internationalization, authentication, validation, and a robust development workflow.

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

### Authentication & Security
- **Auth0 Integration** - Secure authentication and authorization
- **JWT Token Management** - Automatic token handling with interceptors
- **Protected Routes** - Route guards for secure navigation
- **HTTP Interceptors** - Automatic request/response processing

### Internationalization (i18n)
- **Multi-language Support** - English and Turkish translations
- **Dynamic Language Switching** - Runtime language changes
- **Localized Content** - Complete UI translation support
- **Server-side Configuration** - Environment-based language configuration

### Validation & Forms
- **FluentValidation-TS** - Powerful TypeScript validation library
- **Reactive Forms** - Angular reactive forms with custom validators
- **Real-time Validation** - Instant feedback on user input
- **Internationalized Error Messages** - Localized validation messages

### Development Workflow
- **ESLint** - Advanced code linting with TypeScript support
- **Prettier** - Automated code formatting
- **Code Quality Checks** - Pre-build validation scripts
- **Development Certificates** - HTTPS support for local development
- **Hot Reload** - Fast development with live updates

### Deployment & DevOps
- **Docker Support** - Multi-stage Docker builds
- **Nginx Configuration** - Production-ready web server setup
- **Server-side Configuration** - Runtime environment variable injection
- **Multiple Environments** - Development, staging, and production configs

### Payment Integration
- **Stripe Integration** - Secure payment processing
- **Checkout Flow** - Complete e-commerce checkout experience
- **Order Management** - Comprehensive order tracking

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
│   ├── facades/             # State management facades
│   ├── interceptors/        # HTTP interceptors
│   ├── models/              # TypeScript interfaces and types
│   ├── services/            # Business logic services
│   ├── store/               # NgRx store (actions, reducers, effects)
│   ├── validators/          # Form validation logic
│   └── config/              # Application configuration
├── assets/                  # Static assets and styles
├── environments/            # Environment configurations
└── public/                  # Public assets and i18n files
```

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
```bash
npm test
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

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run code quality checks**: `npm run code:check:strict`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is enforced
- **TypeScript**: Strict typing is required
- **Testing**: Include tests for new features
- **Documentation**: Update documentation for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This means you are free to:
- Use the software for any purpose
- Change the software to suit your needs
- Share the software with your friends and neighbors
- Share the changes you make

## 🔗 Related Documentation

- [Components Documentation](./src/app/components/README.md)
- [Store Documentation](./src/app/store/README.md)
- [Services Documentation](./src/app/services/README.md)
- [Facades Documentation](./src/app/facades/README.md)
- [Validators Documentation](./src/app/validators/README.md)

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Angular, NgRx, and modern web technologies**
