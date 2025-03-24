FROM node:16-alpine as frontend-builder

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:16-alpine

# Set up backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production

# Copy backend code
COPY backend/src ./src

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/build ./public

# Expose port 8080
EXPOSE 8080

# Start server
CMD ["node", "src/server.js"]