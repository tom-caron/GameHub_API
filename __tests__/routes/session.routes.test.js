jest.mock('../../middlewares/authMiddleware', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'test-user', role: 'admin' };
    next();
  },
  authorizeRoles: () => (req, res, next) => next(),
  requireSelfOrAdmin: (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../../app'); // Ton app Express
const mongoose = require('mongoose');
const Session = require('../../models/sessionModel');
const Player = require('../../models/playerModel');
const Game = require('../../models/gameModel');
const sessionsServices = require('../../services/sessionsService');

describe('Session Routes', () => {

  describe('POST /api/sessions', () => {
    test('crée une session avec un admin', async () => {
        const player = await Player.create({ username: 'Dave', email: 'dave@test.com', password: 'pwd123', role: 'player' });
        const game = await Game.create({ title: 'Test Game', slug: 'test-game', genre: new mongoose.Types.ObjectId(), platform: new mongoose.Types.ObjectId() });
        
      const res = await request(app)
        .post('/api/sessions')
        .send({
          player: player._id,
          game: game._id
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('session');
        expect(res.body.session.player._id).toBe(player._id.toString());
        expect(res.body.session.game._id).toBe(game._id.toString());

    });

    test('erreur si player ou game manquant', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/sessions', () => {
    test('récupère toutes les sessions pour admin', async () => {
      const res = await request(app)
        .get('/api/sessions')

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.sessions)).toBe(true);
    });
  });

  describe('GET /api/sessions/:id', () => {

    test('récupère une session par id', async () => {
      const session = await Session.create({ player: new mongoose.Types.ObjectId(), game: new mongoose.Types.ObjectId(), score: 0, active: true });
      const res = await request(app)
        .get(`/api/sessions/${session._id}`)

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('session');
        expect(res.body.session._id).toBe(session._id.toString());

    });

    test('erreur si session introuvable', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/sessions/${fakeId}`)

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Session introuvable');
    });
  });

  describe('PUT /api/sessions/:id', () => {

    test('modifie une session', async () => {
      const session = await Session.create({ player: new mongoose.Types.ObjectId(), game: new mongoose.Types.ObjectId(), score: 0, active: true });
      const res = await request(app)
        .put(`/api/sessions/${session._id}`)
        .send({ score: 100, active: false });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('session');
        expect(res.body.session.score).toBe(100);
        expect(res.body.session.active).toBe(false);

    });

    test('erreur si session introuvable', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/sessions/${fakeId}`)
        .send({ score: 50 });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Session introuvable');
    });
  });

  describe('DELETE /api/sessions/:id', () => {

    test('supprime une session', async () => {
      const session = await Session.create({ player: new mongoose.Types.ObjectId(), game: new mongoose.Types.ObjectId(), score: 0, active: true });
      const res = await request(app)
        .delete(`/api/sessions/${session._id}`)

      const deleted = await Session.findById(session._id);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Session supprimé avec succès');

    });

    test('erreur si session introuvable', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/sessions/${fakeId}`)

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Session introuvable');
    });
  });

});
