import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from '../src/server/server'; 

const testUser = 'testuser';
const dataDir = path.join(process.cwd(), 'data', testUser);

// Mock de fs/promises para aislar tests
vi.mock('fs/promises', () => ({
  __esModule: true,
  default: {
    rm: vi.fn(() => Promise.resolve()),
  },
}));

beforeAll(() => {
  // Se invoca al mock de rm
  return fs.rm(dataDir, { recursive: true, force: true });
});

afterAll(() => {
  return fs.rm(dataDir, { recursive: true, force: true });
});

describe('API /funkos (promises)', () => {
  test('GET lista vacía devuelve success:true y funkoPops=[]', () => {
    return request(app)
      .get('/funkos')
      .query({ user: testUser })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.funkoPops)).toBe(true);
        expect(res.body.funkoPops).toHaveLength(0);
      });
  });

  test('POST añade un Funko correctamente', () => {
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

    return request(app)
      .post('/funkos')
      .query({ user: testUser })
      .send(newFunko)
      .set('Content-Type', 'application/json')
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
      });
  });

  test('GET un Funko existente devuelve su información', () => {
    return request(app)
      .get('/funkos')
      .query({ user: testUser, id: 1 })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.funko).toMatchObject({ id: 1, name: 'Test Pop' });
      });
  });

  test('PATCH actualiza un Funko existente', () => {
    const updates = { id: 1, name: 'Test Pop Modificado', marketValue: 75 };
    // primero la petición de patch...
    return request(app)
      .patch('/funkos')
      .query({ user: testUser })
      .send(updates)
      .set('Content-Type', 'application/json')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        // y luego comprobamos con otra llamada GET
        return request(app)
          .get('/funkos')
          .query({ user: testUser, id: 1 });
      })
      .then(getRes => {
        expect(getRes.body.funko.name).toBe('Test Pop Modificado');
        expect(getRes.body.funko.marketValue).toBe(75);
      });
  });

  test('DELETE elimina un Funko existente', () => {
    return request(app)
      .delete('/funkos')
      .query({ user: testUser, id: 1 })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        // comprobación final de que ya no existe
        return request(app)
          .get('/funkos')
          .query({ user: testUser, id: 1 });
      })
      .then(getRes => {
        // como no existe, supertest resolverá con status 404
        expect(getRes.status).toBe(404);
      });
  });
});
