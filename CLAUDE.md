# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MongoDB data exploration tool that allows dynamic querying, visualization and export of MongoDB aggregation results through a web interface. The project integrates into existing web applications via REST API.

### Architecture

- **Frontend**: React-based web interface for query creation and result visualization
- **Backend**: Node.js (Express/Fastify) API server with MongoDB integration
- **Database**: MongoDB for both data storage and metadata about saved queries
- **Visualization**: Tables with pagination/sorting, interactive maps (GeoJSON), and charts

### Key Components

- Query builder interface for MongoDB aggregation pipelines
- Dynamic result rendering (tabular, map, chart views)
- Query persistence with metadata (names, descriptions, column definitions)
- Query selection by name with tag/category system for search and filtering
- Dynamic filtering and server-side pagination
- Export functionality (CSV, Excel with graphs, GeoJSON)

## Development Commands

Since this project is in early stages, standard commands will depend on the chosen stack:

### Expected Node.js Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Lint code
```

### Expected Docker Commands
```bash
docker-compose up -d # Start MongoDB and services
docker build .       # Build application image
```

## Technical Considerations

- MongoDB aggregation pipeline validation and security
- Authentication integration with existing applications
- Role-based access control for queries
- Performance optimization for large datasets
- GeoJSON coordinate handling for map visualizations
- Chart data transformation from MongoDB results
- Query tagging and categorization system for efficient organization
- Excel export with embedded chart/graph generation
- Query metadata indexing for fast name-based search

## Security Requirements

- Validate all MongoDB aggregation pipelines before execution
- Implement query result limits to prevent resource exhaustion
- Secure API endpoints with proper authentication
- Sanitize user inputs in dynamic filters