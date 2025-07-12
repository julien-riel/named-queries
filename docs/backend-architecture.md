# Backend Architecture - MongoDB Named Queries Explorer

## 🏗️ Overview

The backend is a RESTful API service built with Node.js that provides MongoDB aggregation query execution capabilities with dynamic filtering, pagination, and result transformation. The architecture follows a layered approach with clear separation of concerns.

## 📋 Core Responsibilities

- **Query Management**: CRUD operations for saved MongoDB aggregation pipelines
- **Query Execution**: Dynamic execution with runtime filters, sorting, and pagination
- **Result Transformation**: Format results based on metadata definitions
- **Export Services**: Generate CSV, Excel, and GeoJSON exports
- **Pipeline Security**: Validate and whitelist MongoDB operators
- **Integration APIs**: Provide endpoints for external system integration

## 🔧 Technology Stack

### Runtime & Framework
- **Node.js** (≥18.x) - JavaScript runtime
- **Express.js** or **Fastify** - Web application framework
- **TypeScript** - Type safety and enhanced development experience

### Database & ODM
- **MongoDB** (≥4.4) - Primary database with aggregation pipeline support
- **Mongoose** - Object Document Mapper (ODM) for schema definition and validation
- **MongoDB Driver** - Direct connection for complex aggregation operations

### Validation & Security
- **Joi** - Schema validation for API requests and MongoDB pipelines
- **Helmet** - Security headers middleware
- **Rate Limiting** - Request throttling and abuse prevention

### Utilities
- **Redis** (Optional) - Caching layer for query results and metadata
- **Winston** - Structured logging
- **Compression** - Response compression middleware

## 🏛️ Architectural Layers

```
┌─────────────────────────────────────────┐
│               API Layer                 │
│  (Routes, Middleware, Request/Response) │
├─────────────────────────────────────────┤
│             Service Layer               │
│    (Business Logic, Query Execution)   │
├─────────────────────────────────────────┤
│            Repository Layer             │
│     (Data Access, MongoDB Operations)  │
├─────────────────────────────────────────┤
│             Database Layer              │
│         (MongoDB, Query Storage)       │
└─────────────────────────────────────────┘
```

### 1. API Layer (`/src/routes/`)
**Responsibilities:**
- HTTP request routing and parameter validation
- Authentication middleware (when implemented)
- Request/response transformation
- Error handling and HTTP status code management

**Key Components:**
- `queries.routes.js` - Query CRUD and execution endpoints
- `export.routes.js` - Data export endpoints
- `health.routes.js` - Application health checks

### 2. Service Layer (`/src/services/`)
**Responsibilities:**
- Business logic implementation
- Query pipeline construction and validation
- Result aggregation and transformation
- Export format generation

**Key Components:**
- `QueryService` - Query management and execution logic
- `PipelineValidator` - MongoDB operator whitelisting and validation
- `ExportService` - Multi-format export generation
- `MetadataService` - Column metadata and formatting rules

### 3. Repository Layer (`/src/repositories/`)
**Responsibilities:**
- Database abstraction and connection management
- MongoDB aggregation pipeline execution
- Query metadata persistence
- Data access optimization

**Key Components:**
- `QueryRepository` - Saved query CRUD operations
- `DataRepository` - Dynamic collection querying
- `CacheRepository` - Redis caching operations (optional)

### 4. Database Layer
**Collections:**
- `named_queries` - Stored query definitions and metadata
- `{business_collections}` - User data collections for querying

## 🚀 Core Services

### Query Management Service

```typescript
interface QueryDefinition {
  id: string;
  name: string;
  description: string;
  tags: string[];
  pipeline: object[];
  metadata: ColumnMetadata[];
  filters: FilterDefinition[];
  createdAt: Date;
  updatedAt: Date;
}

interface ColumnMetadata {
  field: string;
  displayName: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'geopoint';
  sortable: boolean;
  filterable: boolean;
  formatter?: string;
}
```

### Pipeline Execution Service

**Dynamic Query Construction:**
```javascript
// Base saved pipeline
const basePipeline = query.pipeline;

// Runtime modifications
const dynamicPipeline = [
  ...basePipeline,
  { $match: buildDynamicFilters(filters) },
  { $sort: buildSortStage(sortOptions) },
  { $skip: pagination.offset },
  { $limit: pagination.limit }
];
```

**Security Validation:**
- Whitelist allowed MongoDB operators (`$match`, `$group`, `$project`, etc.)
- Reject dangerous operations (`$eval`, `$where`, `$function`)
- Validate pipeline complexity and execution time limits

### Export Service

**Supported Formats:**
- **CSV**: Standard comma-separated values
- **Excel**: XLSX with formatted headers and data types
- **GeoJSON**: For geographical data visualization

**Implementation:**
```typescript
interface ExportOptions {
  format: 'csv' | 'xlsx' | 'geojson';
  includeHeaders: boolean;
  customFields?: string[];
  maxRecords?: number;
}
```

## 📡 API Endpoints

### Query Management
```
GET    /api/queries              # List all saved queries
POST   /api/queries              # Create new query
GET    /api/queries/:id          # Get query by ID
PUT    /api/queries/:id          # Update query
DELETE /api/queries/:id          # Delete query
```

### Query Execution
```
POST   /api/queries/:id/execute  # Execute query with filters
GET    /api/queries/:id/count    # Get result count only
POST   /api/queries/:id/validate # Validate query pipeline
```

### Data Export
```
POST   /api/queries/:id/export   # Export results
GET    /api/exports/:exportId    # Download generated export
```

### Integration
```
GET    /api/embed/:queryId       # Embedded query endpoint
GET    /api/schemas/:queryId     # Query result schema
```

## 🔒 Security Architecture

### Pipeline Validation
```typescript
const ALLOWED_OPERATORS = [
  '$match', '$group', '$project', '$sort', '$limit', '$skip',
  '$lookup', '$unwind', '$addFields', '$bucket', '$facet'
];

const FORBIDDEN_OPERATORS = [
  '$eval', '$where', '$function', '$accumulator', '$reduce'
];
```

### Input Sanitization
- Joi schema validation for all API inputs
- MongoDB query parameter sanitization
- File upload validation for data imports

### Resource Limits
```typescript
const EXECUTION_LIMITS = {
  maxExecutionTime: 30000,    // 30 seconds
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB
  maxResultSize: 10000,       // 10k records
  maxPipelineStages: 20       // Pipeline complexity
};
```

## 📊 Performance Considerations

### Caching Strategy
- **Query Results**: Redis cache for frequently executed queries
- **Metadata**: In-memory cache for column definitions
- **Aggregation Results**: TTL-based caching for expensive operations

### Database Optimization
- **Indexes**: Automatic index suggestions based on query patterns
- **Connection Pooling**: Optimized MongoDB connection management
- **Query Analysis**: Performance monitoring and slow query detection

### Scalability
- **Horizontal Scaling**: Stateless service design for load balancing
- **Background Processing**: Queue-based export generation for large datasets
- **Resource Monitoring**: Memory and CPU usage tracking

## 🔌 Integration Patterns

### External System Integration
```typescript
// Power BI Integration
app.get('/api/powerbi/:queryId', async (req, res) => {
  const results = await queryService.execute(queryId, {
    format: 'odata',
    metadata: true
  });
  res.json(results);
});

// Webhook Notifications
app.post('/api/queries/:id/webhook', async (req, res) => {
  const { url, events } = req.body;
  await webhookService.register(queryId, url, events);
});
```

### Embedded Analytics
- iframe-compatible endpoints with CORS configuration
- JWT-based authentication for embedded scenarios
- Customizable themes and branding options

## 🧪 Testing Strategy

### Unit Tests (Jest)
- Service layer business logic validation
- Repository layer data access testing
- Utility function and helper method testing

### Integration Tests
- API endpoint request/response validation
- Database operation testing with test fixtures
- External service integration mocking

### Performance Tests
- Query execution time benchmarking
- Memory usage profiling under load
- Concurrent request handling validation

## 🚀 Deployment Architecture

### Environment Configuration
```bash
# Required Variables
MONGODB_URI=mongodb://localhost:27017/named-queries
NODE_ENV=production
PORT=4000

# Optional Variables
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
MAX_QUERY_EXECUTION_TIME=30000
ENABLE_QUERY_CACHE=true
```

### Docker Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

### Health Monitoring
- `/health` endpoint for load balancer checks
- `/metrics` endpoint for Prometheus monitoring
- Structured logging for observability

---

This architecture provides a robust, scalable foundation for the MongoDB Named Queries Explorer backend, with clear separation of concerns and comprehensive security measures.