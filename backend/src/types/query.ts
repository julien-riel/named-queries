export interface NamedQuery {
  _id?: string;
  name: string;
  description?: string;
  tags: string[];
  categories: string[];
  pipeline: Record<string, unknown>[];
  metadata: {
    columns: ColumnDefinition[];
    visualization: VisualizationConfig;
    filters: FilterDefinition[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ColumnDefinition {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array';
  displayName?: string;
  sortable?: boolean;
  filterable?: boolean;
  formatter?: string;
}

export interface VisualizationConfig {
  defaultView: 'table' | 'map' | 'chart';
  chart?: {
    type: 'bar' | 'line' | 'pie' | 'scatter';
    xAxis?: string;
    yAxis?: string;
  };
  map?: {
    geoJsonField?: string;
    coordinateFields?: {
      lat: string;
      lng: string;
    };
  };
}

export interface FilterDefinition {
  field: string;
  type: 'text' | 'number' | 'date' | 'range' | 'select';
  options?: string[];
  defaultValue?: unknown;
}

export interface QueryExecutionRequest {
  queryId: string;
  filters?: Record<string, unknown>;
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface QueryExecutionResult {
  data: Record<string, unknown>[];
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  executionTime: number;
}