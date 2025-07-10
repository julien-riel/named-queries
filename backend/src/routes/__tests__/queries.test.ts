import request from 'supertest';
import express from 'express';
import { NamedQueryModel } from '../../models/NamedQuery';
import queryRoutes from '../queries';

const app = express();
app.use(express.json());
app.use('/api/queries', queryRoutes);

describe('Query Routes', () => {
  beforeEach(async () => {
    await NamedQueryModel.deleteMany({});
  });

  describe('GET /api/queries', () => {
    it('should return empty array when no queries exist', async () => {
      const response = await request(app).get('/api/queries');
      
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should return queries when they exist', async () => {
      const testQuery = new NamedQueryModel({
        name: 'Test Query',
        description: 'A test query',
        tags: ['test'],
        categories: ['testing'],
        pipeline: [{ $match: { status: 'active' } }],
        metadata: {
          columns: [],
          visualization: { defaultView: 'table' },
          filters: []
        }
      });
      
      await testQuery.save();

      const response = await request(app).get('/api/queries');
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Query');
    });
  });

  describe('POST /api/queries', () => {
    it('should create a new query', async () => {
      const queryData = {
        name: 'New Query',
        description: 'A new query',
        tags: ['new'],
        categories: ['development'],
        pipeline: [{ $match: { active: true } }],
        metadata: {
          columns: [],
          visualization: { defaultView: 'table' },
          filters: []
        }
      };

      const response = await request(app)
        .post('/api/queries')
        .send(queryData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Query');
      expect(response.body._id).toBeDefined();
    });

    it('should return error for invalid query data', async () => {
      const invalidData = {
        description: 'Missing required name field'
      };

      const response = await request(app)
        .post('/api/queries')
        .send(invalidData);

      expect(response.status).toBe(500);
    });
  });
});