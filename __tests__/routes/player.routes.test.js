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
const Player = require('../../models/playerModel');

describe('Player Routes', () => {

  beforeEach(async () => {
    // Vide la collection avant chaque test
    await Player.deleteMany();
  });

  test('GET /api/players retourne tous les joueurs', async () => {
    await Player.create({ username: 'Alice', email: 'alice@test.com', password: 'pwd123', role: 'player' });

    const res = await request(app).get('/api/players');
    expect(res.statusCode).toBe(200);
    expect(res.body.players.length).toBeGreaterThanOrEqual(1);
    expect(res.body.players[0]).toHaveProperty('username', 'Alice');
  });

  test('GET /api/players/:id retourne un joueur', async () => {
    const player = await Player.create({ username: 'Bob', email: 'bob@test.com', password: 'pwd123', role: 'player' });

    const res = await request(app).get(`/api/players/${player._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.player.username).toBe('Bob');
  });

  test('PUT /api/players/:id modifie un joueur', async () => {
    const player = await Player.create({ username: 'Charlie', email: 'charlie@test.com', password: 'pwd123', role: 'player' });

    const res = await request(app)
      .put(`/api/players/${player._id}`)
      .send({ username: 'CharlieNew', email: 'charlienew@test.com', role: 'admin' });

    expect(res.statusCode).toBe(200);
    expect(res.body.player.username).toBe('CharlieNew');
    expect(res.body.player.email).toBe('charlienew@test.com');
    expect(res.body.player.role).toBe('admin');
  });

  test('DELETE /api/players/:id supprime un joueur', async () => {
    const player = await Player.create({ username: 'Dave', email: 'dave@test.com', password: 'pwd123', role: 'player' });

    const res = await request(app).delete(`/api/players/${player._id}`);
    expect(res.statusCode).toBe(200);

    const found = await Player.findById(player._id);
    expect(found).toBeNull();
  });

  test('PUT /api/players/:id échoue si email déjà utilisé', async () => {
    const player1 = await Player.create({ username: 'Eve', email: 'eve@test.com', password: 'pwd123', role: 'player' });
    const player2 = await Player.create({ username: 'Eve2', email: 'eve2@test.com', password: 'pwd123', role: 'player' });

    const res = await request(app)
      .put(`/api/players/${player2._id}`)
      .send({ email: 'eve@test.com' }); // email déjà utilisé

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email déjà utilisé');
  });

  test('PUT /api/players/:id échoue si username déjà utilisé', async () => {
    const player1 = await Player.create({ username: 'Frank', email: 'frank@test.com', password: 'pwd123', role: 'player' });
    const player2 = await Player.create({ username: 'Frank2', email: 'frank2@test.com', password: 'pwd123', role: 'player' });

    const res = await request(app)
      .put(`/api/players/${player2._id}`)
      .send({ username: 'Frank' }); // username déjà utilisé

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Username déjà utilisé');
  });

});
