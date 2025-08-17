# # Stage 1: Build Angular
# FROM node:22-alpine AS build

# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# # Stage 2: Production image
# FROM node:22-alpine

# WORKDIR /usr/app

# # Copy built Angular files
# COPY --from=build /app/dist/herbistclient ./browser

# # Copy static files
# COPY src/sitemap.xml ./browser/
# COPY src/robots.txt ./browser/

# EXPOSE 4000
# CMD ["node", "./server/server.mjs"]


# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build both browser and server bundles
RUN npm run build
# postbuild/purgecss will run automatically if configured

# Stage 2: Production
FROM node:22-alpine

WORKDIR /usr/app

# Copy browser bundle
COPY --from=build /app/dist/herbistclient/browser ./browser
# Copy server bundle
COPY --from=build /app/dist/herbistclient/server ./server

# Copy package.json for production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy static assets
COPY src/sitemap.xml ./browser/
COPY src/robots.txt ./browser/

EXPOSE 4000
CMD ["node", "./server/main.server.mjs"]