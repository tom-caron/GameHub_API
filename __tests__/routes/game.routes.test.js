jest.mock('../../middlewares/authMiddleware', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'test-user', role: 'admin' };
    next();
  },
  authorizeRoles: () => (req, res, next) => next(),
  requireSelfOrAdmin: (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../app');
const Genre = require('../../models/genreModel');
const Platform = require('../../models/platformModel');
const Game = require('../../models/gameModel');

describe('POST /api/games', () => {

  test('crée un jeu via l’API', async () => {
    const genre = await Genre.create({ name: 'RPG', slug: 'rpg' });
    const platform = await Platform.create({ name: 'PS5', slug: 'ps5' });

    const res = await request(app)
      .post('/api/games')
      .send({
        title: 'API Game',
        slug: 'api-game',
        genre: genre._id,
        platform: platform._id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.game.title).toBe('API Game');
  });

});


describe('GET /api/games/:id', () => {

  test('récupère un jeu existant', async () => {
    const genre = await Genre.create({ name: 'Action', slug: 'action' });
    const platform = await Platform.create({ name: 'PC', slug: 'pc' });

    const game = await Game.create({
      title: 'Route Test Game',
      slug: 'route-test-game',
      genre: genre._id,
      platform: platform._id
    });

    const res = await request(app)
      .get(`/api/games/${game._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.game.title).toBe('Route Test Game');
    expect(res.body.game.genre.name).toBe('Action');
    expect(res.body.game.platform.name).toBe('PC');
  });

  test('retourne 404 si le jeu n’existe pas', async () => {
    const fakeId = '64f000000000000000000000';

    const res = await request(app)
      .get(`/api/games/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Jeu introuvable');
  });

});


describe('PUT /api/games/:id', () => {

  test('modifie un jeu existant via l’API', async () => {
    const genre = await Genre.create({ name: 'Action', slug: 'action' });
    const newGenre = await Genre.create({ name: 'RPG', slug: 'rpg' });
    const platform = await Platform.create({ name: 'PC', slug: 'pc' });
    const newPlatform = await Platform.create({ name: 'PS5', slug: 'ps5' });

    const game = await Game.create({
      title: 'Original Game',
      slug: 'original-game',
      genre: genre._id,
      platform: platform._id
    });

    const res = await request(app)
      .put(`/api/games/${game._id}`)
      .send({
        title: 'Updated Game',
        slug: 'updated-game',
        genre: newGenre._id,
        platform: newPlatform._id
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.game.title).toBe('Updated Game');
    expect(res.body.game.genre.name).toBe('RPG');
    expect(res.body.game.platform.name).toBe('PS5');
  });

  test('retourne 404 si le jeu n’existe pas', async () => {
    const fakeId = '64f000000000000000000000';

    const res = await request(app)
      .put(`/api/games/${fakeId}`)
      .send({ title: 'Updated' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Jeu introuvable');
  });

});


describe('DELETE /api/games/:id', () => {

  test('supprime un jeu via l’API', async () => {
    const genre = await Genre.create({ name: 'RPG', slug: 'rpg' });
    const platform = await Platform.create({ name: 'PS5', slug: 'ps5' });
    const game = await Game.create({
      title: 'API Delete Test',
      slug: 'api-delete-test',
      genre: genre._id,
      platform: platform._id
    });

    const res = await request(app)
      .delete(`/api/games/${game._id}`)
      .set('Authorization', 'Bearer testtoken'); // si tu as un auth middleware

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Jeu supprimé avec succès');

    const found = await Game.findById(game._id);
    expect(found).toBeNull();
  });

});


describe('GET /api/games/:id', () => {

  test('récupère un jeu via l’API', async () => {
    const genre = await Genre.create({ name: 'RPG', slug: 'rpg' });
    const platform = await Platform.create({ name: 'PS5', slug: 'ps5' });

    const game = await Game.create({
      title: 'API Game',
      slug: 'api-game',
      genre: genre._id,
      platform: platform._id
    });

    const res = await request(app)
      .get(`/api/games/${game._id}`)
      .set('Authorization', 'Bearer testtoken'); // bypass auth

    expect(res.statusCode).toBe(200);
    expect(res.body.game).toBeDefined();
    expect(res.body.game.title).toBe('API Game');
    expect(res.body.game.genre.name).toBe('RPG');
    expect(res.body.game.platform.name).toBe('PS5');
  });

  test('erreur si jeu inexistant', async () => {
    const fakeId = '64f000000000000000000000';
    const res = await request(app)
      .get(`/api/games/${fakeId}`)
      .set('Authorization', 'Bearer testtoken');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Jeu introuvable');
  });

});
