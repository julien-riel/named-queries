# MongoDB Named Queries Explorer

A dynamic MongoDB data exploration tool that integrates into existing web applications. This tool allows users to **define, execute, and visualize MongoDB aggregation queries** through a browser interface, with a REST API providing server-client communication.

The goal is to **offer a flexible querying interface** and **present results as tables, maps, or charts** for analysis.

## 🚀 Features

### 1. 📥 MongoDB Query Definition via Forms

* Web interface for creating MongoDB aggregation pipelines
* Simple UI for a query. Aggregate Query are in plain-text json.
* Each query is persisted with:
  * Unique identifier
  * Human-readable name (selection by name)
  * Description
  * Tags/categories for search and filtering
  * Metadata: column names, types, formatters, sortable flags, etc.
  * Dynamic filter definitions

### 2. 📊 Tabular Visualization

* Results displayed in dynamic tables:
  * Complete pagination (total count known)
  * Server-side sorting on defined columns
  * Dynamic column filters (text, value, ranges, etc.)
  * Individual record view mode

### 3. 🗺️ Map Visualization

* Interactive map display when results contain GeoJSON fields or coordinates
* Support for clustering and heatmaps where applicable

### 4. 📈 Chart Visualization

* Automatic chart generation when results contain data series (label, val1, val2, etc.):
  * Bar charts, line charts, pie charts, etc.
  * Customizable chart types and axes

## 🏗️ Architecture

No Authentication for now. Don't do nothing about it

### Frontend (Angular)

* Simple Interface with textboxes, text area, select for creating, configuring, and testing aggregation queries (no complex form and interactivity)
* Rendering components: table, record view, map, chart
* Dynamic filter forms generated from metadata

### Backend (Node.js - Express/Fastify)

* REST API for:
  * Listing and managing saved queries
  * Executing queries with pagination, sorting, filters
  * Returning transformed results based on client parameters
* Middleware to dynamically wrap MongoDB queries with conditions (match, sort, skip, limit)
* Security: pipeline validation, NO authentication 

### Database (MongoDB)

* Business data storage
* Dedicated collection for custom queries (pipelines + metadata)

## 💡 Advanced Features

| Feature | Description |
|---------|-------------|
| 🔄 Execution History | Track executed queries (timestamp, parameters) |
| 💾 Export | Export results to CSV/Excel (with embedded charts)/GeoJSON |
| 📦 Integration Plugin | Expose each query as external data source (JSON endpoints for Power BI, etc.) |
| 🧪 Test Mode | Sandbox interface for testing queries before saving |

## 🧰 Technology Stack

### Frontend
* **Framework**: Angular + TypeScript
* **UI Library**: Angular Material / Tailwind CSS
* **Charts**: Chart.js or ng2-charts
* **Maps**: Leaflet
* **Build Tool**: Angular CLI

### Backend
* **Runtime**: Node.js (Express/Fastify)
* **Database ODM**: Mongoose
* **Validation**: Joi schema validation

### Testing
* **Unit Tests**: Jest for backend and frontend unit testing
* **E2E Tests**: Cypress for end-to-end testing
* **API Tests**: Jest + Supertest for API endpoint testing
* **Frontend Tests**: Angular Testing Library + Jest

### Database
* **Primary**: MongoDB ≥ 4.4 with aggregation support
* **Collections**: Business data + query metadata

### DevOps
* **Containerization**: Docker
* **Reverse Proxy**: Nginx / Traefik integration
* **Deployment**: Container orchestration ready

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* MongoDB 4.4+
* Docker (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd named-queries

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string and other settings

# Start development servers
npm run dev

# Run tests
npm test              # Run all tests (Jest + Cypress)
npm run test:unit     # Run unit tests only (Jest)
npm run test:e2e      # Run end-to-end tests (Cypress)
npm run test:watch    # Run tests in watch mode
```

### Docker Setup

```bash
# Start MongoDB and services
docker-compose up -d

# Access the application
open http://localhost:3000
```

## 📖 Usage

1. **Create a Query**: Use the query form to create MongoDB aggregation queries
2. **Configure Metadata**: Define column types, display names, and visualization preferences
3. **Test & Save**: Test your query in sandbox mode, then save with tags and description
4. **Execute & Visualize**: Run saved queries with dynamic filters and view results as tables, charts, or maps
5. **Export**: Download results in various formats (CSV, Excel, GeoJSON)

## 🔧 Configuration

### Environment Variables

```bash
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-jwt-secret
NODE_ENV=development
PORT=4000
REDIS_URL=redis://localhost:6379 # Optional for caching
```

### Integration with Existing Applications

```javascript
// Embed as iframe
<iframe src="/named-queries/embed?queryId=123" />

// Angular component integration
import { QueryRendererComponent } from '@named-queries/angular';
<named-queries-renderer [queryId]="'123'" [theme]="'dark'"></named-queries-renderer>

// API integration
const results = await fetch('/api/queries/123/execute', {
  method: 'POST',
  body: JSON.stringify({ filters: {...}, pagination: {...} })
});
```

## 🧪 Testing Strategy

### Unit Testing (Jest)
* **Backend**: API endpoints, business logic, MongoDB operations
* **Frontend**: Angular components, services, pipes
* **Coverage**: Minimum 80% code coverage required
* **Mocking**: External dependencies (MongoDB, HTTP requests)

### End-to-End Testing (Cypress)
* **User Flows**: Complete query creation and execution workflows
* **Visual Testing**: Chart rendering, table pagination, map interactions
* **Cross-browser**: Chrome, Firefox, Safari support
* **Test Data**: Isolated test database with fixture data

### API Testing
* **Integration Tests**: Jest + Supertest for API endpoints
* **Validation**: Request/response schema validation
* **Error Handling**: HTTP status codes and error messages
* **Performance**: Response time and load testing

### Testing Commands
```bash
# Run all tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Open Cypress interactive mode
npm run cypress:open

# Generate test reports
npm run test:report
```

## 🔒 Security

* Pipeline validation with operator whitelisting
* Query complexity limits (execution time, memory usage)
* Input sanitization and validation

## 📚 Documentation

* [API Reference](./docs/api.md) - Complete API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

* [Issues](https://github.com/your-username/named-queries/issues) - Bug reports and feature requests
* [Discussions](https://github.com/your-username/named-queries/discussions) - Community support and questions

---

Built with ❤️ for dynamic MongoDB data exploration