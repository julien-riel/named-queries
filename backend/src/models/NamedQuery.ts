import mongoose, { Schema, Document } from 'mongoose';
import { NamedQuery } from '../types/query';

export interface NamedQueryDocument extends Omit<NamedQuery, '_id'>, Document {}

const ColumnDefinitionSchema = new Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['string', 'number', 'date', 'boolean', 'object', 'array'], 
    required: true 
  },
  displayName: { type: String },
  sortable: { type: Boolean, default: true },
  filterable: { type: Boolean, default: true },
  formatter: { type: String }
});

const VisualizationConfigSchema = new Schema({
  defaultView: { 
    type: String, 
    enum: ['table', 'map', 'chart'], 
    default: 'table' 
  },
  chart: {
    type: {
      type: String,
      enum: ['bar', 'line', 'pie', 'scatter']
    },
    xAxis: String,
    yAxis: String
  },
  map: {
    geoJsonField: String,
    coordinateFields: {
      lat: String,
      lng: String
    }
  }
});

const FilterDefinitionSchema = new Schema({
  field: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'number', 'date', 'range', 'select'], 
    required: true 
  },
  options: [String],
  defaultValue: Schema.Types.Mixed
});

const NamedQuerySchema = new Schema<NamedQueryDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  tags: [{ type: String }],
  categories: [{ type: String }],
  pipeline: [{ type: Schema.Types.Mixed, required: true }],
  metadata: {
    columns: [ColumnDefinitionSchema],
    visualization: VisualizationConfigSchema,
    filters: [FilterDefinitionSchema]
  }
}, {
  timestamps: true
});

NamedQuerySchema.index({ name: 1 });
NamedQuerySchema.index({ tags: 1 });
NamedQuerySchema.index({ categories: 1 });

export const NamedQueryModel = mongoose.model<NamedQueryDocument>('NamedQuery', NamedQuerySchema);