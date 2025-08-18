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

# Inject envs at container start (before nginx serves files)
# Any *.sh under /scripts runs automatically in nginx:alpine
COPY scripts/10-ngssc.sh /docker-entrypoint.d/10-ngssc.sh
RUN chmod +x /docker-entrypoint.d/10-ngssc.sh

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
