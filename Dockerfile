# Multi-stage Docker build for HVAC ERP Application
FROM node:20-alpine AS builder

WORKDIR /app

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

# Generate database schema & compile TypeScript
RUN cd backend && npx prisma generate && npx prisma db push --skip-generate && npm run build && npm run db:seed
RUN cd frontend && npm run build

# Production runtime container
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000
ENV DATABASE_URL="file:./dev.db"

# Copy compiled output artifacts
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dev.db ./backend/dev.db
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 10000

CMD ["node", "backend/dist/index.js"]
