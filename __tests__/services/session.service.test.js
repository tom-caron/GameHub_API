const sessionsServices = require('../../services/sessionsService');
const Player = require('../../models/playerModel');
const Game = require('../../models/gameModel');
const Session = require('../../models/sessionModel');
const mongoose = require('mongoose');

describe('SessionService – creationSession', () => {

  test('crée une session valide', async () => {
    const player = await Player.create({ username: 'player1', email: 'player1@test.com', password: '123456', role: 'player' });
    const game = await Game.create({ title: 'Test Game', slug: 'test-game', genre: new mongoose.Types.ObjectId(), platform: new mongoose.Types.ObjectId() });

    const session = await sessionsServices.creationSession(player._id, game._id);
    expect(session).toBeDefined();
    expect(session.player._id.toString()).toBe(player._id.toString());
    expect(session.game._id.toString()).toBe(game._id.toString());
    expect(session.active).toBe(true);
  });

  test('erreur si player ou game manquant', async () => {
    await expect(sessionsServices.creationSession(null, null)).rejects.toThrow('Le champ player et game est requis');
  });

  test('erreur si joueur déjà dans une session active', async () => {
    const player = await Player.create({ username: 'player2', email: 'player2@test.com', password: '123456', role: 'player' });
    const game1 = await Game.create({ title: 'Game1', slug: 'game1', genre: new mongoose.Types.ObjectId(), platform: new mongoose.Types.ObjectId() });
    const game2 = await Game.create({ title: 'Game2', slug: 'game2', genre: new mongoose.Types.ObjectId(), platform: new mongoose.Types.ObjectId() });

    await sessionsServices.creationSession(player._id, game1._id);

    await expect(sessionsServices.creationSession(player._id, game2._id))
      .rejects.toThrow('Le joueur est déjà dans une session active');
  });

});

describe('SessionService – getOneSessionId', () => {

  test('retourne une session existante', async () => {
    const player = await Player.create({ username: 'player3', email: 'player3@test.com', password: '123456', role: 'player' });
    const game = await Game.create({ title: 'Game3', slug: 'game3', genre: new mongoose.Types.ObjectId(), platform: new mongoose.Types.ObjectId() });

    const session = await sessionsServices.creationSession(player._id, game._id);
    const foundSession = await sessionsServices.getOneSessionId(session._id);

    expect(foundSession).toBeDefined();
    expect(foundSession.player._id.toString()).toBe(player._id.toString());
  });

  test('erreur si session introuvable', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(sessionsServices.getOneSessionId(fakeId)).rejects.toThrow('Session introuvable');
  });

});

describe('SessionService – modifySession', () => {

  test('modifie une session existante', async () => {
    const player = await Player.create({ username: 'player4', email: 'player4@test.com', password: '123456', role: 'player' });
    const game = await Game.create({ title: 'Game4', slug: 'game4', genre: new mongoose.Types.ObjectId(), platform: new mongoose.Types.ObjectId() });

    const session = await sessionsServices.creationSession(player._id, game._id);

    const updatedSession = await sessionsServices.modifySession(session._id, null, null, 500, false);

    expect(updatedSession.score).toBe(500);
    expect(updatedSession.active).toBe(false);
  });

  test('erreur si session introuvable', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(sessionsServices.modifySession(fakeId, null, null, 10, true))
      .rejects
      .toThrow('Session introuvable');
  });

});

describe('SessionService – deleteSessionById', () => {

  test('supprime une session existante', async () => {
    const player = await Player.create({ username: 'player5', email: 'player5@test.com', password: '123456', role: 'player' });
    const game = await Game.create({ title: 'Game5', slug: 'game5', genre: new mongoose.Types.ObjectId(), platform: new mongoose.Types.ObjectId() });

    const session = await sessionsServices.creationSession(player._id, game._id);
    await expect(sessionsServices.deleteSessionById(session._id)).resolves.not.toThrow();

    const found = await Session.findById(session._id);
    expect(found).toBeNull();
  });

  test('erreur si session introuvable', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(sessionsServices.deleteSessionById(fakeId)).rejects.toThrow('Session introuvable');
  });

});

describe('SessionService – countSessions', () => {

  test('retourne le nombre total de sessions', async () => {
    const countBefore = await sessionsServices.countSessions();
    const player = await Player.create({ username: 'player6', email: 'player6@test.com', password: '123456', role: 'player' });
    const game = await Game.create({ title: 'Game6', slug: 'game6', genre: new mongoose.Types.ObjectId(), platform: new mongoose.Types.ObjectId() });

    await sessionsServices.creationSession(player._id, game._id);
    const countAfter = await sessionsServices.countSessions();

    expect(countAfter).toBe(countBefore + 1);
  });

});
