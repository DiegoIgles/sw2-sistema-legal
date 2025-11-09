# Build
FROM node:20-alpine AS builder
WORKDIR /app
# Install devDependencies here so we can run the build (nest CLI, typescript, etc.)
COPY package*.json ./
# include dev dependencies in the builder
RUN npm ci
COPY . .
RUN npm run build

# Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
