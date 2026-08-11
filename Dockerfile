# Multi-stage Docker build for HVAC ERP Application
FROM node:20-alpine AS builder

WORKDIR /app

ENV DATABASE_URL="file:./dev.db"

# Copy dependency definitions
COPY package.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy application source code
COPY backend ./backend
COPY frontend ./frontend

# Generate Prisma Client & compile TypeScript & Vite frontend
RUN cd backend && npx prisma generate && npm run build
RUN cd frontend && npm run build

# Production runtime container
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL="file:./dev.db"

# Copy source, compiled outputs, and node_modules
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

# Runtime command: Sync SQLite schema, seed data, and start server
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx tsx prisma/seed.ts && node dist/src/index.js"]
