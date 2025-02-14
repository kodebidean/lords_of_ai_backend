const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');

describe('AI Models API', () => {
  beforeAll(async () => {
    // Configurar base de datos de prueba
  });

  afterAll(async () => {
    await pool.end();
  });

  test('GET /api/ai-models debería retornar lista de modelos', async () => {
    const response = await request(app).get('/api/ai-models');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });
}); 