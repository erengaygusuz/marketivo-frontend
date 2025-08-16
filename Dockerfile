# ---- Stage 1: Build Angular App ----
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build Angular app for production
RUN npm run build:no-check --configuration=production

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# ✅ Remove default Nginx page to avoid conflicts
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular files to Nginx html directory
COPY --from=build /app/dist/marketivo-frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]