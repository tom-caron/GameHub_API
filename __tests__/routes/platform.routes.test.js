jest.mock('../../middlewares/authMiddleware', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'test-user', role: 'admin' };
    next();
  },
  authorizeRoles: () => (req, res, next) => next(),
  requireSelfOrAdmin: (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../app'); // ton app Express
const Platform = require('../../models/platformModel');

describe('Platform Routes', () => {

  test('POST /api/platforms crée une plateforme', async () => {
    const res = await request(app)
      .post('/api/platforms')
      .send({ name: 'PC', slug: 'pc' });

    expect(res.statusCode).toBe(201);
    expect(res.body.platform.name).toBe('PC');
  });

  test('GET /api/platforms retourne toutes les plateformes', async () => {
    await Platform.create({ name: 'Switch', slug: 'switch' });
    const res = await request(app).get('/api/platforms');
    expect(res.statusCode).toBe(200);
    expect(res.body.platforms.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/platforms/:id retourne une plateforme', async () => {
    const platform = await Platform.create({ name: 'Xbox', slug: 'xbox' });
    const res = await request(app).get(`/api/platforms/${platform._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.platform.name).toBe('Xbox');
  });

  test('PUT /api/platforms/:id modifie une plateforme', async () => {
    const platform = await Platform.create({ name: 'Old-${Date.now()}', slug: 'old' });
    const res = await request(app)
      .put(`/api/platforms/${platform._id}`)
      .send({ name: 'New', slug: 'new' });
    expect(res.statusCode).toBe(200);
    expect(res.body.platform.name).toBe('New');
  });

  test('DELETE /api/platforms/:id supprime une plateforme', async () => {
    const platform = await Platform.create({ name: 'ToDelete', slug: 'todelete' });
    const res = await request(app).delete(`/api/platforms/${platform._id}`);
    expect(res.statusCode).toBe(200);
    const found = await Platform.findById(platform._id);
    expect(found).toBeNull();
  });

});
