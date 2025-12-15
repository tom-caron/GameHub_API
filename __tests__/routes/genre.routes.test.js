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
const Genre = require('../../models/genreModel');

describe('Genre routes', () => {

  beforeEach(async () => {
    await Genre.deleteMany({});
  });

  test('POST /api/genres crée un genre', async () => {
    const res = await request(app)
      .post('/api/genres')
      .send({ name: 'Action', slug: 'action' });

    expect(res.statusCode).toBe(201);
    expect(res.body.genre.name).toBe('Action');
  });

  test('GET /api/genres récupère la liste', async () => {
    await Genre.create({ name: 'RPG', slug: 'rpg' });
    const res = await request(app)
      .get('/api/genres');

    expect(res.statusCode).toBe(200);
    expect(res.body.genres.length).toBe(1);
  });

  test('GET /api/genres/:id récupère un genre', async () => {
    const genre = await Genre.create({ name: 'Aventure', slug: 'aventure' });
    const res = await request(app)
      .get(`/api/genres/${genre._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.genre.name).toBe('Aventure');
  });

  test('PUT /api/genres/:id modifie un genre', async () => {
    const genre = await Genre.create({ name: 'Old', slug: 'old' });
    const res = await request(app)
      .put(`/api/genres/${genre._id}`)
      .send({ name: 'New', slug: 'new' });

    expect(res.statusCode).toBe(200);
    expect(res.body.genre.name).toBe('New');
  });

  test('DELETE /api/genres/:id supprime un genre', async () => {
    const genre = await Genre.create({ name: 'ToDelete', slug: 'todelete' });
    const res = await request(app)
      .delete(`/api/genres/${genre._id}`);
      
    expect(res.statusCode).toBe(200);
  });

});
