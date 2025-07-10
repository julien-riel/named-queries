# MongoDB Named Queries Explorer

A dynamic MongoDB data exploration tool that integrates into existing web applications. This tool allows users to **define, execute, and visualize MongoDB aggregation queries** through a browser interface, with a REST API providing server-client communication.

The goal is to **offer a flexible querying interface** and **present results as tables, maps, or charts** for analysis.

## 🚀 Features

### 1. 📥 MongoDB Query Definition via Forms

* Web interface for creating MongoDB aggregation pipelines
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

* Interface for creating, configuring, and testing aggregation queries
* Rendering components: table, record view, map, chart
* Dynamic filter forms generated from metadata

### Backend (Node.js - Express/Fastify)

* REST API for:
  * Listing and managing saved queries
  * Executing queries with pagination, sorting, filters
  * Returning transformed results based on client parameters
* Middleware to dynamically wrap MongoDB queries with conditions (match, sort, skip, limit)
* Security: pipeline validation, authentication, role-based access control

### Database (MongoDB)

* Business data storage
* Dedicated collection for custom queries (pipelines + metadata)

## 💡 Advanced Features

| Feature | Description |
|---------|-------------|
| 🔄 Execution History | Track executed queries (timestamp, user, parameters) |
| 💾 Export | Export results to CSV/Excel (with embedded charts)/GeoJSON |
| 🔐 Permissions | Role-based query visibility and execution rights |
| 🎯 Favorites/Dashboards | Group queries into user dashboards |
| 📦 Integration Plugin | Expose each query as external data source (JSON endpoints for Power BI, etc.) |
| 🧪 Test Mode | Sandbox interface for testing queries before saving |
| 🧠 Auto-suggestions | Pipeline creation with auto-completion and pre-built blocks (like MongoDB Compass) |

## 🧰 Technology Stack

### Frontend
* **Framework**: React + TypeScript
* **UI Library**: Material UI / Tailwind CSS
* **Charts**: Recharts
* **Maps**: MapLibre
* **Build Tool**: Vite

### Backend
* **Runtime**: Node.js (Express/Fastify)
* **Database ODM**: Mongoose
* **Validation**: Joi schema validation

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
```

### Docker Setup

```bash
# Start MongoDB and services
docker-compose up -d

# Access the application
open http://localhost:3000
```

## 📖 Usage

1. **Create a Query**: Use the visual pipeline builder to create MongoDB aggregation queries
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

// React component integration
import { QueryRenderer } from '@named-queries/react';
<QueryRenderer queryId="123" theme="dark" />

// API integration
const results = await fetch('/api/queries/123/execute', {
  method: 'POST',
  body: JSON.stringify({ filters: {...}, pagination: {...} })
});
```

## 🔒 Security

* Pipeline validation with operator whitelisting
* Query complexity limits (execution time, memory usage)
* Role-based access control
* Input sanitization and validation
* Resource usage monitoring

## 📚 Documentation

* [API Reference](./docs/api.md) - Complete API documentation
* [Deployment Guide](./docs/deployment.md) - Production deployment instructions

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