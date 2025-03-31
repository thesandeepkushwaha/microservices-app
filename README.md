# Microservices Application

A TypeScript-based microservices application using Express.js, MongoDB, and Redis for message queuing.

## Project Structure

The application follows a monorepo structure using pnpm workspaces:

- `packages/`: Shared libraries used across services
  - `common`: Common types, interfaces, and constants
  - `database`: MongoDB connection and utilities
  - `logger`: Logging utilities
  - `redis`: Redis connection and pub/sub utilities
- `services/`: Individual microservices
  - `receiver-service`: REST API for receiving user data
  - `listener-service`: Background service that processes messages from Redis

## Prerequisites

- Node.js (v18 or later)
- pnpm (v8.9.0 or later)
- Docker and Docker Compose (for running MongoDB and Redis)

## Getting Started

### 1. Install pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm@latest
```

### 2. Clone the repository

```bash
git clone <repository-url>
cd microservices-app
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Set up environment variables

Create a `.env` file in the root directory:

```
MONGO_URI=mongodb://localhost:27017/user_db
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:3000
```

### 5. Start MongoDB and Redis using Docker

```bash
docker-compose up -d mongodb redis
```

### 6. Build all packages and services

```bash
pnpm build:all
```

### 7. Start the services in development mode

```bash
pnpm dev
```

This will start both the receiver and listener services in development mode with hot reloading.

## API Documentation

The receiver service includes Swagger documentation available at:

```
http://localhost:3000/api-docs
```

## Docker Deployment

Build and run all services using Docker Compose:

```bash
docker-compose up --build
```

## Available Scripts

- `pnpm build`: Build all packages and services
- `pnpm dev`: Start all services in development mode
- `pnpm lint`: Run ESLint on all TypeScript files
- `pnpm format`: Format code using Prettier

## Project Architecture

This application follows a microservices architecture:

1. **Receiver Service** (Port 3000): REST API that receives user data, validates it, stores it in MongoDB, and publishes events to Redis.

2. **Listener Service**: Background service that subscribes to Redis channels, processes events, and performs additional operations.

The services communicate asynchronously through Redis pub/sub channels, allowing for loose coupling and independent scaling.

## License

MIT
