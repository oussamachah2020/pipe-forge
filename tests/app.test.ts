import request from 'supertest';
import { createApp } from '../src/app';
import { Database } from '../src/db';
import * as fs from 'fs';
import express from 'express';

describe('Express API Integration Tests', () => {
  let app: express.Application;
  let db: Database;
  const testDbPath = './test-api-database.sqlite';

  // Setup before all tests
  beforeAll(async () => {
    // Remove old test database if it exists
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    // Initialize database using factory method
    db = await Database.create(testDbPath);

    // Create Express app with initialized database
    app = createApp(db);
  });

  // Cleanup after all tests
  afterAll(async () => {
    // Close database connection
    await db.close();

    // Remove test database file
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /items', () => {
    it('should create a new item', async () => {
      const newItem = {
        name: 'Test Item',
        description: 'Test Description',
      };

      const response = await request(app)
        .post('/items')
        .send(newItem)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newItem.name);
    });

    it('should return error when name is missing', async () => {
      const response = await request(app)
        .post('/items')
        .send({ description: 'No name provided' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /items', () => {
    it('should return all items', async () => {
      // Create test items first
      await request(app)
        .post('/items')
        .send({ name: 'Item 1', description: 'First item' });
      await request(app)
        .post('/items')
        .send({ name: 'Item 2', description: 'Second item' });

      // Get all items
      const response = await request(app).get('/items');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(2);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
