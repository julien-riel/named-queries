# Architecture - MongoDB Named Queries Explorer

## Overview

This system provides a dynamic MongoDB aggregation query builder and visualization platform that can be integrated into existing web applications. It allows users to create, save, and execute MongoDB aggregation pipelines with real-time visualization of results.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Node.js API    │    │    MongoDB      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │Query Builder│ │◄──►│ │Query Service│ │◄──►│ │Business Data│ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │Visualizations│ │◄──►│ │Viz Service  │ │    │ │Query Metadata│ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │                 │
│ │Export Tools │ │◄──►│ │Export Service│ │    │                 │
│ └─────────────┘ │    │ └─────────────┘ │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Zustand for global state
- **Charts**: Recharts for data visualization
- **Maps**: Leaflet with React-Leaflet
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database ODM**: Mongoose
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi for schema validation
- **File Processing**: Multer for uploads
- **Background Jobs**: Node.js worker threads

#### Database
- **Primary**: MongoDB 6.0+
- **Collections**:
  - Business data (user-defined)
  - `named_queries` - Saved query definitions
  - `query_executions` - Execution history
  - `users` - User management (if not integrated)

#### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Logging**: Winston

## Core Components

### 1. Query Builder Service

**Responsibilities:**
- Visual MongoDB aggregation pipeline editor
- Pipeline validation and sanitization
- Query testing in sandbox mode
- Query metadata management

**Key Features:**
- Drag-and-drop pipeline stages
- Auto-completion for field names
- Pipeline syntax validation
- Preview results during building

**Security Measures:**
- Whitelist allowed aggregation operators
- Query complexity limits (max stages, execution time)
- Resource usage monitoring

### 2. Query Execution Engine

**Responsibilities:**
- Execute validated aggregation pipelines
- Apply dynamic filters and sorting
- Handle pagination and result limits
- Optimize query performance with MongoDB indexes

**Architecture Pattern:**
```javascript
// Pipeline wrapper pattern
const executePipeline = async (queryId, filters, pagination) => {
  const baseQuery = await getStoredQuery(queryId);
  const pipeline = [
    ...baseQuery.pipeline,
    { $match: buildDynamicFilters(filters) },
    { $sort: pagination.sort },
    { $skip: pagination.offset },
    { $limit: pagination.limit }
  ];
  
  return await collection.aggregate(pipeline);
};
```

### 3. Visualization Engine

**Pluggable Architecture:**
- **Table Renderer**: AG-Grid for complex tables
- **Chart Renderer**: Recharts wrapper
- **Map Renderer**: Leaflet with clustering
- **Export Renderer**: Background job processing

**Data Flow:**
```
Raw MongoDB Result → Data Transformer → Visualization Adapter → UI Component
```

### 4. Authentication & Authorization

**Integration Patterns:**
- **Standalone**: Built-in JWT authentication
- **Integrated**: Middleware for existing auth systems
- **SSO**: OIDC/SAML integration support

**Permission Model:**
- Query-level permissions (read/write/execute)
- Data-level row security (optional)
- Role-based access control

## Data Models

### Named Query Schema

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  tags: [String],
  
  // MongoDB aggregation pipeline
  pipeline: [Object],
  
  // Target collection
  collection: String,
  database: String,
  
  // Result metadata
  columns: [{
    name: String,
    type: 'string' | 'number' | 'date' | 'boolean' | 'geopoint',
    displayName: String,
    sortable: Boolean,
    filterable: Boolean,
    formatter: String // date format, number format, etc.
  }],
  
  // Visualization settings
  visualizations: [{
    type: 'table' | 'chart' | 'map',
    config: Object // type-specific configuration
  }],
  
  // Access control
  permissions: {
    owner: ObjectId,
    readers: [ObjectId],
    executors: [ObjectId]
  },
  
  // Metadata
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  executionCount: Number,
  avgExecutionTime: Number
}
```

### Query Execution History

```javascript
{
  _id: ObjectId,
  queryId: ObjectId,
  executedBy: ObjectId,
  executedAt: Date,
  parameters: {
    filters: Object,
    pagination: Object,
    sort: Object
  },
  executionTime: Number,
  resultCount: Number,
  success: Boolean,
  error: String
}
```

## API Design

### RESTful Endpoints

```typescript
// Query Management
GET    /api/queries                 // List queries with filtering
POST   /api/queries                 // Create new query
GET    /api/queries/:id             // Get query details
PUT    /api/queries/:id             // Update query
DELETE /api/queries/:id             // Delete query

// Query Execution
POST   /api/queries/:id/execute     // Execute query with parameters
GET    /api/queries/:id/preview     // Preview query results (limited)
POST   /api/queries/:id/export      // Start export job

// Query Building
POST   /api/queries/validate        // Validate pipeline
GET    /api/collections             // List available collections
GET    /api/collections/:name/schema // Get collection field schema

// Export Management
GET    /api/exports/:jobId          // Get export job status
GET    /api/exports/:jobId/download // Download export file

// Execution History
GET    /api/queries/:id/executions  // Get execution history
```

### WebSocket Events

```typescript
// Real-time query testing
'query:test' → { pipeline, collection }
'query:result' ← { data, count, executionTime }
'query:error' ← { error, stage }

// Export progress
'export:progress' ← { jobId, progress, status }
'export:complete' ← { jobId, downloadUrl }
```

## Security Architecture

### Pipeline Validation

```javascript
const ALLOWED_OPERATORS = [
  '$match', '$project', '$group', '$sort', '$limit', '$skip',
  '$lookup', '$unwind', '$addFields', '$count'
];

const BLOCKED_OPERATORS = [
  '$out', '$merge', '$planCacheClear', '$currentOp'
];

const validatePipeline = (pipeline) => {
  // Check operator whitelist
  // Validate resource limits
  // Scan for injection attempts
  // Estimate execution complexity
};
```

### Resource Limits

```javascript
const EXECUTION_LIMITS = {
  maxStages: 20,
  maxExecutionTime: 30000, // 30 seconds
  maxResultSize: 1000000,  // 1M documents
  maxMemoryUsage: 100 * 1024 * 1024 // 100MB
};
```

## Performance Strategies

### In-Memory Caching

```javascript
// Simple in-memory cache with TTL
const queryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getResults = async (queryId, params) => {
  const cacheKey = generateKey(queryId, params);
  const cached = queryCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const results = await executeQuery(queryId, params);
  
  queryCache.set(cacheKey, {
    data: results,
    timestamp: Date.now()
  });
  
  // Clean expired entries periodically
  if (queryCache.size > 1000) {
    cleanExpiredCache();
  }
  
  return results;
};
```

### Database Optimization

- **Indexes**: Auto-suggest indexes based on query patterns
- **Aggregation Optimization**: Pipeline stage reordering for efficiency
- **Read Preferences**: Use secondary reads for analytics
- **Connection Pooling**: Optimized connection management
- **Query Hints**: Allow index hints for complex queries

## Development Environment

### Docker Composition

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: named-queries-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: named_queries
    networks:
      - named-queries-network

  nginx:
    image: nginx:alpine
    container_name: named-queries-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - mongodb
    networks:
      - named-queries-network

volumes:
  mongodb_data:

networks:
  named-queries-network:
    driver: bridge
```

### Nginx Configuration Template

```nginx
upstream api_backend {
    server host.docker.internal:4000;
}

upstream frontend {
    server host.docker.internal:3000;
}

server {
    listen 80;
    server_name localhost;

    # Frontend routes
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API routes
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Integration Patterns

### Embedding in Existing Applications

```javascript
// iframe integration
<iframe src="/named-queries/embed?queryId=123" />

// Component integration  
import { QueryRenderer } from '@named-queries/react';
<QueryRenderer queryId="123" theme="dark" />

// API integration
const results = await fetch('/api/queries/123/execute');
```

### Authentication Integration

```javascript
// Custom auth middleware
app.use('/api', (req, res, next) => {
  const token = extractToken(req);
  const user = validateWithExistingSystem(token);
  req.user = user;
  next();
});
```

This architecture provides a scalable, secure, and flexible foundation for the MongoDB named queries explorer while maintaining integration capabilities with existing systems.