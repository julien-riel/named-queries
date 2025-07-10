# Setup Guide

## Project Architecture

This project follows the architecture outlined in the README.md but uses **React** instead of Angular for the frontend, as specified in the README's technology stack.

### Directory Structure

```
named-queries/
├── backend/           # Node.js Express API
├── frontend/          # React + TypeScript frontend
├── docker-compose.yml # Development environment
├── package.json       # Root package.json for scripts
└── init-mongo.js      # MongoDB initialization
```

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Start Development Environment**
   ```bash
   npm run dev
   ```
   This will:
   - Start MongoDB via Docker
   - Start the backend on http://localhost:4000
   - Start the frontend on http://localhost:3000

3. **Alternative: Docker-only setup**
   ```bash
   npm run docker:up
   ```

## Development Scripts

```bash
# Install all dependencies
npm run install:all

# Development (requires Docker for MongoDB)
npm run dev

# Test everything
npm run test

# Lint everything
npm run lint

# Type check everything
npm run typecheck

# Build everything
npm run build

# Docker management
npm run docker:up     # Start all services
npm run docker:down   # Stop all services
npm run docker:logs   # View logs
```

## Environment Configuration

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your settings (optional for development)

## Backend Details

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest with MongoDB Memory Server
- **Linting**: ESLint with TypeScript support
- **Port**: 4000

### API Endpoints

- `GET /api/queries` - List all queries
- `POST /api/queries` - Create new query
- `GET /api/queries/:id` - Get specific query
- `PUT /api/queries/:id` - Update query
- `DELETE /api/queries/:id` - Delete query
- `GET /health` - Health check

## Frontend Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Port**: 3000

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# All tests
npm run test
```

## Database

MongoDB runs in Docker with:
- Username: `admin`
- Password: `password`
- Database: `named-queries`
- Port: `27017`

The database is automatically initialized with:
- User accounts
- Indexes for queries collection
- Initial collections

## Troubleshooting

### MongoDB Connection Issues
```bash
docker-compose down
docker-compose up -d mongodb
# Wait 30 seconds for MongoDB to start
npm run dev:backend
```

### Port Conflicts
Update ports in `docker-compose.yml` and `.env` if needed.

### Permission Issues
```bash
# Fix Docker permissions (Linux)
sudo chown -R $USER:$USER .
```

## Next Steps

1. Implement query builder interface (Phase 2.1)
2. Add visualization components (Phase 3)
3. Configure production deployment

See `TECHNICAL_ROADMAP.md` for detailed development phases.