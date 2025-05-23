# Use official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# ---- Production image ----
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production deps
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy built app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set environment variables (optional)
ENV NODE_ENV=production

# Start the app
EXPOSE 3000
CMD ["npx", "next", "start"]