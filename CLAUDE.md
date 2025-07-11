# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MongoDB Named Queries Explorer - a dynamic data exploration tool that integrates into existing web applications. The tool allows users to define, execute, and visualize MongoDB aggregation queries through a browser interface with REST API communication.

## Architecture

The project follows a full-stack architecture:

### Frontend (React + TypeScript)
- **Framework**: React with TypeScript
- **UI Library**: Material UI / Tailwind CSS  
- **Charts**: Recharts for data visualization
- **Maps**: MapLibre for geographic data
- **Build Tool**: Vite
- **Components**: Query forms, table renderer, record view, map viewer, chart generator

### Backend (Node.js)
- **Runtime**: Node.js with Express/Fastify
- **Database ODM**: Mongoose for MongoDB interaction
- **Validation**: Joi schema validation
- **Security**: Pipeline validation with operator whitelisting

### Database (MongoDB)
- **Primary Database**: MongoDB ≥ 4.4 with aggregation support
- **Collections**: Business data + query metadata storage
- **Features**: Aggregation pipelines, GeoJSON support

## Development Commands

Since this is a new project, these commands will be available once the development setup is complete:

```bash
# Install dependencies
npm install

# Start development servers (both frontend and backend)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Key Features to Implement

1. **Query Management**: Create, save, and execute MongoDB aggregation pipelines
2. **Visualization**: Dynamic tables with pagination, sorting, and filtering
3. **Geographic Data**: Map visualization for GeoJSON fields
4. **Charts**: Automatic chart generation for data series
5. **Export**: CSV/Excel/GeoJSON export functionality
6. **Integration**: Embed queries as external data sources

## Development Guidelines

### Query Pipeline Structure
- Each query includes: unique ID, name, description, tags, metadata, filters
- Metadata defines: column names, types, formatters, sortable flags
- Security: Pipeline validation with operator whitelisting

### API Endpoints Structure
- `/api/queries` - List and manage saved queries
- `/api/queries/:id/execute` - Execute query with pagination/sorting/filters
- `/api/queries/:id/export` - Export results in various formats

### Security Considerations
- No authentication system (as specified in README)
- Pipeline validation with MongoDB operator whitelisting
- Query complexity limits (execution time, memory usage)
- Input sanitization and validation

## Environment Configuration

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Application port (default: 4000)
- `REDIS_URL` - Optional Redis caching

## Integration Capabilities

The tool is designed to integrate with existing applications through:
- iframe embedding: `/named-queries/embed?queryId=123`
- React component integration
- Direct API access for external systems (Power BI, etc.)

## File Structure (When Implemented)

```
/
├── frontend/          # React TypeScript application
├── backend/           # Node.js Express API
├── shared/            # Shared types and utilities
├── docs/              # API documentation
├── docker-compose.yml # Development environment
└── .env.example       # Environment template
```