import { beforeAll, afterAll, describe, test, expect } from 'vitest';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from '../src/server/server'; 

const testUser = 'testuser';
const dataDir = path.join(process.cwd(), 'data', testUser);

beforeAll(async () => {
  await fs.rm(dataDir, { recursive: true, force: true });
});

afterAll(async () => {
  await fs.rm(dataDir, { recursive: true, force: true });
});

describe('API /funkos', () => {
  test('GET lista vacía devuelve success:true y funkoPops=[]', async () => {
    const res = await request(app)
      .get('/funkos')
      .query({ user: testUser });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.funkoPops)).toBe(true);
    expect(res.body.funkoPops).toHaveLength(0);
  });

  test('POST añade un Funko correctamente', async () => {
    const newFunko = {
      id: 1,
      name: 'Test Pop',
      description: 'Descripción de prueba',
      type: 'Pop!',
      genre: 'Animación',
      franchise: 'Test Franchise',
      number: 100,
      exclusive: false,
      specialFeatures: 'Ninguna',
      marketValue: 50
    };

    const res = await request(app)
      .post('/funkos')
      .query({ user: testUser })
      .send(newFunko)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('GET un Funko existente devuelve su información', async () => {
    const res = await request(app)
      .get('/funkos')
      .query({ user: testUser, id: 1 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.funko).toMatchObject({ id: 1, name: 'Test Pop' });
  });

  test('PATCH actualiza un Funko existente', async () => {
    const updates = { id: 1, name: 'Test Pop Modificado', marketValue: 75 };
    const res = await request(app)
      .patch('/funkos')
      .query({ user: testUser })
      .send(updates)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const getRes = await request(app)
      .get('/funkos')
      .query({ user: testUser, id: 1 });
    expect(getRes.body.funko.name).toBe('Test Pop Modificado');
    expect(getRes.body.funko.marketValue).toBe(75);
  });

  test('DELETE elimina un Funko existente', async () => {
    const res = await request(app)
      .delete('/funkos')
      .query({ user: testUser, id: 1 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const getRes = await request(app)
      .get('/funkos')
      .query({ user: testUser, id: 1 });
    expect(getRes.status).toBe(404);
  });
});
