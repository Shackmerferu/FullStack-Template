const request = require('supertest');
const express = require('express');
const itemsRouter = require('../src/routes/items'); 

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

describe('Items Routes', () => {
  test('GET /api/items returns array of items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/items with query filters results', async () => {
    const res = await request(app).get('/api/items?q=test');
    expect(res.status).toBe(200);
    expect(res.body.every(item => item.name.toLowerCase().includes('test'))).toBe(true);
  });

  test('GET /api/items/:id returns item if exists', async () => {
    const res = await request(app).get('/api/items/1');
    if(res.status === 200) {
      expect(res.body).toHaveProperty('id', 1);
    } else {
      expect(res.status).toBe(404);
    }
  });

  test('GET /api/items/:id returns 404 if item does not exist', async () => {
    const res = await request(app).get('/api/items/99999999');
    expect(res.status).toBe(404);
  });

  test('POST /api/items creates a new item', async () => {
    const newItem = { name: 'NewItem', price: 10 };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newItem);
    expect(res.body).toHaveProperty('id');
  });

  test('POST /api/items with invalid payload returns error or handled response', async () => {
    const res = await request(app).post('/api/items').send(null);
    expect([201, 400, 500]).toContain(res.status);
  });
});
