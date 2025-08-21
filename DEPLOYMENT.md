# Deployment Guide

This guide covers deployment strategies, configuration, and best practices for the Marketivo Frontend application in various environments.

## 🐳 Docker Deployment

### Multi-Stage Docker Build

The application uses a multi-stage Docker build for optimal production images:

```dockerfile
# ---- Stage 1: Build Angular App ----
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies (use ci for repeatable builds if lockfile present)
COPY package*.json ./
RUN npm ci || npm install

# Copy source
COPY . .

# Build with ngssc target so it generates ngssc.json alongside the build
# (Requires the ngssc target we added in angular.json)
RUN npx ng run marketivo-frontend:ngsscbuild:production

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app (contains index.html + ngssc.json)
COPY --from=build /app/dist/marketivo-frontend/browser /usr/share/nginx/html

# Install the tiny ngssc injector binary (choose the latest release/arch you need)
# For x86_64 Alpine:
ADD https://github.com/kyubisation/angular-server-side-configuration/releases/download/v20.0.0/ngssc_64bit /usr/local/bin/ngssc
RUN chmod +x /usr/local/bin/ngssc

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple startup script to inject environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'ngssc /usr/share/nginx/html' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the startup script as entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
```

### Building the Docker Image

```bash
# Build the Docker image
docker build -t marketivo-frontend:latest .

# Build with specific tag
docker build -t marketivo-frontend:v1.0.0 .

# Build for different platforms
docker buildx build --platform linux/amd64,linux/arm64 -t marketivo-frontend:latest .
```

### Running the Container

#### Basic Run

```bash
docker run -d \
  --name marketivo-frontend \
  -p 80:80 \
  marketivo-frontend:latest
```

#### With Environment Variables

```bash
docker run -d \
  --name marketivo-frontend \
  -p 80:80 \
  -e PROD=true \
  -e API_ADDRESS=https://api.marketivo.com \
  -e STRIPE_PK=pk_live_your_stripe_key \
  -e AUTH_DOMAIN=auth.marketivo.com \
  -e AUTH_CLIENT_ID=your_auth0_client_id \
  -e AUTH_AUDIENCE=https://api.marketivo.com \
  -e DEFAULT_LANG=en-US \
  -e SUPPORTED_LANGS=en-US,tr-TR \
  marketivo-frontend:latest
```

#### Using Environment File

Create a `.env` file:
```env
PROD=true
API_ADDRESS=https://api.marketivo.com
STRIPE_PK=pk_live_your_stripe_key
AUTH_DOMAIN=auth.marketivo.com
AUTH_CLIENT_ID=your_auth0_client_id
AUTH_AUDIENCE=https://api.marketivo.com
DEFAULT_LANG=en-US
SUPPORTED_LANGS=en-US,tr-TR
```

Run with environment file:
```bash
docker run -d \
  --name marketivo-frontend \
  -p 80:80 \
  --env-file .env \
  marketivo-frontend:latest
```

## 🚀 Docker Compose Deployment

### Single Service

```yaml
# docker-compose.yml
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
      - AUTH_DOMAIN=auth.marketivo.com
      - AUTH_CLIENT_ID=your_auth0_client_id
      - AUTH_AUDIENCE=https://api.marketivo.com
      - DEFAULT_LANG=en-US
      - SUPPORTED_LANGS=en-US,tr-TR
    restart: unless-stopped
    networks:
      - marketivo-network

networks:
  marketivo-network:
    driver: bridge
```

### Full Stack with Backend

```yaml
# docker-compose.full.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - PROD=true
      - API_ADDRESS=http://backend:8080
      - STRIPE_PK=${STRIPE_PK}
      - AUTH_DOMAIN=${AUTH_DOMAIN}
      - AUTH_CLIENT_ID=${AUTH_CLIENT_ID}
      - AUTH_AUDIENCE=${AUTH_AUDIENCE}
      - DEFAULT_LANG=en-US
      - SUPPORTED_LANGS=en-US,tr-TR
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - marketivo-network

  backend:
    image: marketivo-backend:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
    networks:
      - marketivo-network

  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=marketivo
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - marketivo-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    networks:
      - marketivo-network

volumes:
  postgres_data:

networks:
  marketivo-network:
    driver: bridge
```

### Production with SSL

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build: .
    environment:
      - PROD=true
      - API_ADDRESS=https://api.marketivo.com
      - STRIPE_PK=${STRIPE_PK}
      - AUTH_DOMAIN=${AUTH_DOMAIN}
      - AUTH_CLIENT_ID=${AUTH_CLIENT_ID}
      - AUTH_AUDIENCE=${AUTH_AUDIENCE}
    restart: unless-stopped
    networks:
      - marketivo-network

  nginx-proxy:
    image: nginxproxy/nginx-proxy:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs
      - ./vhost:/etc/nginx/vhost.d
      - ./html:/usr/share/nginx/html
    environment:
      - DEFAULT_HOST=marketivo.com
    restart: unless-stopped
    networks:
      - marketivo-network

  letsencrypt:
    image: nginxproxy/acme-companion
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./certs:/etc/nginx/certs
      - ./vhost:/etc/nginx/vhost.d
      - ./html:/usr/share/nginx/html
      - ./acme:/etc/acme.sh
    environment:
      - DEFAULT_EMAIL=admin@marketivo.com
    restart: unless-stopped
    networks:
      - marketivo-network

networks:
  marketivo-network:
    driver: bridge
```

## ☁️ Cloud Deployment

### AWS ECS Deployment

#### Task Definition

```json
{
  "family": "marketivo-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "your-registry/marketivo-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PROD",
          "value": "true"
        },
        {
          "name": "API_ADDRESS",
          "value": "https://api.marketivo.com"
        }
      ],
      "secrets": [
        {
          "name": "STRIPE_PK",
          "valueFrom": "/marketivo/stripe/public-key"
        },
        {
          "name": "AUTH_CLIENT_ID",
          "valueFrom": "/marketivo/auth0/client-id"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/marketivo-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "essential": true
    }
  ]
}
```

#### Service Definition

```json
{
  "serviceName": "marketivo-frontend",
  "cluster": "marketivo-cluster",
  "taskDefinition": "marketivo-frontend",
  "desiredCount": 2,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": [
        "subnet-12345678",
        "subnet-87654321"
      ],
      "securityGroups": [
        "sg-12345678"
      ],
      "assignPublicIp": "ENABLED"
    }
  },
  "loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:region:account:targetgroup/marketivo-frontend/1234567890123456",
      "containerName": "frontend",
      "containerPort": 80
    }
  ]
}
```

### Google Cloud Run

#### Deploy Script

```bash
#!/bin/bash

# Build and push to Google Container Registry
docker build -t gcr.io/PROJECT_ID/marketivo-frontend:latest .
docker push gcr.io/PROJECT_ID/marketivo-frontend:latest

# Deploy to Cloud Run
gcloud run deploy marketivo-frontend \
  --image gcr.io/PROJECT_ID/marketivo-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars PROD=true \
  --set-env-vars API_ADDRESS=https://api.marketivo.com \
  --set-env-vars DEFAULT_LANG=en-US \
  --set-env-vars SUPPORTED_LANGS=en-US,tr-TR \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 100 \
  --concurrency 80
```

#### Cloud Run YAML

```yaml
# cloudrun.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: marketivo-frontend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 80
      containers:
      - image: gcr.io/PROJECT_ID/marketivo-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: PROD
          value: "true"
        - name: API_ADDRESS
          value: "https://api.marketivo.com"
        - name: STRIPE_PK
          valueFrom:
            secretKeyRef:
              key: latest
              name: stripe-public-key
        - name: AUTH_CLIENT_ID
          valueFrom:
            secretKeyRef:
              key: latest
              name: auth0-client-id
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
```

### Azure Container Instances

```yaml
# azure-container.yaml
apiVersion: 2019-12-01
location: eastus
name: marketivo-frontend
properties:
  containers:
  - name: frontend
    properties:
      image: your-registry.azurecr.io/marketivo-frontend:latest
      ports:
      - port: 80
        protocol: TCP
      environmentVariables:
      - name: PROD
        value: "true"
      - name: API_ADDRESS
        value: "https://api.marketivo.com"
      - name: DEFAULT_LANG
        value: "en-US"
      - name: SUPPORTED_LANGS
        value: "en-US,tr-TR"
      resources:
        requests:
          cpu: 0.5
          memoryInGB: 0.5
  osType: Linux
  restartPolicy: Always
  ipAddress:
    type: Public
    ports:
    - protocol: TCP
      port: 80
  imageRegistryCredentials:
  - server: your-registry.azurecr.io
    username: your-registry
    password: your-password
```

## 🌐 CDN and Edge Deployment

### AWS CloudFront

```json
{
  "DistributionConfig": {
    "CallerReference": "marketivo-frontend-123456789",
    "DefaultRootObject": "index.html",
    "Comment": "Marketivo Frontend Distribution",
    "Enabled": true,
    "PriceClass": "PriceClass_All",
    "Origins": [
      {
        "Id": "S3-marketivo-frontend",
        "DomainName": "marketivo-frontend.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": "origin-access-identity/cloudfront/ABCDEFG1234567"
        }
      }
    ],
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-marketivo-frontend",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
      "CachedMethods": ["GET", "HEAD"],
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      },
      "Compress": true,
      "DefaultTTL": 86400,
      "MaxTTL": 31536000
    },
    "CacheBehaviors": [
      {
        "PathPattern": "/api/*",
        "TargetOriginId": "API-Origin",
        "ViewerProtocolPolicy": "https-only",
        "AllowedMethods": ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
        "CachedMethods": ["GET", "HEAD"],
        "TTL": 0
      }
    ],
    "CustomErrorResponses": [
      {
        "ErrorCode": 404,
        "ResponseCode": 200,
        "ResponsePagePath": "/index.html"
      }
    ]
  }
}
```

### Vercel Deployment

```json
{
  "name": "marketivo-frontend",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/marketivo-frontend/browser"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "PROD": "true",
    "API_ADDRESS": "@api-address",
    "STRIPE_PK": "@stripe-public-key",
    "AUTH_DOMAIN": "@auth0-domain",
    "AUTH_CLIENT_ID": "@auth0-client-id",
    "AUTH_AUDIENCE": "@auth0-audience"
  }
}
```

## 🔧 Environment Configuration

### Environment Variables Reference

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `PROD` | Production mode flag | No | `false` | `true` |
| `API_ADDRESS` | Backend API base URL | Yes | `/api` | `https://api.marketivo.com` |
| `STRIPE_PK` | Stripe publishable key | Yes | Test key | `pk_live_...` |
| `AUTH_DOMAIN` | Auth0 domain | Yes | Default | `auth.marketivo.com` |
| `AUTH_CLIENT_ID` | Auth0 client ID | Yes | Default | `abc123...` |
| `AUTH_AUDIENCE` | Auth0 API audience | Yes | Default | `https://api.marketivo.com` |
| `DEFAULT_LANG` | Default language | No | `en-US` | `tr-TR` |
| `SUPPORTED_LANGS` | Supported languages | No | `en-US,tr-TR` | `en-US,tr-TR,de-DE` |

### Environment-Specific Configurations

#### Development
```env
PROD=false
API_ADDRESS=http://localhost:8080
STRIPE_PK=pk_test_...
AUTH_DOMAIN=dev-auth.marketivo.com
AUTH_CLIENT_ID=dev_client_id
AUTH_AUDIENCE=http://localhost:8080
DEFAULT_LANG=en-US
SUPPORTED_LANGS=en-US,tr-TR
```

#### Staging
```env
PROD=false
API_ADDRESS=https://api-staging.marketivo.com
STRIPE_PK=pk_test_...
AUTH_DOMAIN=staging-auth.marketivo.com
AUTH_CLIENT_ID=staging_client_id
AUTH_AUDIENCE=https://api-staging.marketivo.com
DEFAULT_LANG=en-US
SUPPORTED_LANGS=en-US,tr-TR
```

#### Production
```env
PROD=true
API_ADDRESS=https://api.marketivo.com
STRIPE_PK=pk_live_...
AUTH_DOMAIN=auth.marketivo.com
AUTH_CLIENT_ID=prod_client_id
AUTH_AUDIENCE=https://api.marketivo.com
DEFAULT_LANG=en-US
SUPPORTED_LANGS=en-US,tr-TR
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run code quality checks
      run: npm run code:check:strict
    
    - name: Run tests
      run: npm test -- --watch=false --browsers=ChromeHeadless

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          ghcr.io/${{ github.repository }}:latest
          ghcr.io/${{ github.repository }}:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Add your deployment commands here
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

test:
  stage: test
  image: node:20-alpine
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run code:check:strict
    - npm test -- --watch=false --browsers=ChromeHeadless
  artifacts:
    reports:
      junit: junit.xml
      coverage: coverage/
    expire_in: 1 day

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - |
      curl -X POST "$DEPLOY_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"image\":\"$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\"}"
  only:
    - main
  when: manual
```

## 📊 Monitoring and Logging

### Health Check Endpoint

Add to `nginx.conf`:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Main application
    location / {
        try_files $uri /index.html;
    }
}
```

### Application Monitoring

```typescript
// Add to main.ts
import { environment } from './environments/environment';

if (environment.production) {
  // Add error tracking
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to monitoring service
  });

  // Add performance monitoring
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Performance:', entry);
        // Send to monitoring service
      }
    });
    observer.observe({ entryTypes: ['navigation', 'resource'] });
  }
}
```

## 🔐 Security Considerations

### Content Security Policy

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.marketivo.com https://auth.marketivo.com;
">
```

### Security Headers in Nginx

```nginx
server {
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Remove server signature
    server_tokens off;
}
```

## 🔗 Related Documentation

- [Main README](../README.md) - Project overview
- [Development Guide](../docs/development.md) - Local development setup
- [Configuration Guide](../docs/configuration.md) - Environment configuration
- [Troubleshooting Guide](../docs/troubleshooting.md) - Common issues and solutions

## 📝 Best Practices

- **Use Multi-stage Builds** - Minimize image size and attack surface
- **Environment Variables** - Never hardcode secrets in images
- **Health Checks** - Implement proper health check endpoints
- **Logging** - Use structured logging for better observability
- **Security** - Keep dependencies updated and use security scanning
- **Monitoring** - Monitor application performance and errors
- **Backup** - Regular backup of configuration and data
- **Documentation** - Keep deployment documentation updated
